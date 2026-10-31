import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Stripe from "stripe";
import { getServiceSupabase } from "@/lib/supabase";
import { PRICING_PLANS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const razorpaySig = req.headers.get("x-razorpay-signature");

  // 1. Handle Razorpay Subscription / Order Webhooks (HMAC-SHA256)
  if (razorpaySig) {
    const rzpWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!rzpWebhookSecret) {
      return NextResponse.json(
        { error: "Razorpay webhook secret not configured." },
        { status: 400 }
      );
    }

    const expectedSig = crypto
      .createHmac("sha256", rzpWebhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSig !== razorpaySig) {
      return NextResponse.json(
        { error: "Invalid Razorpay webhook signature." },
        { status: 400 }
      );
    }

    const payload = JSON.parse(rawBody);
    const eventType: string = payload.event || "";

    if (
      eventType === "subscription.activated" ||
      eventType === "subscription.charged" ||
      eventType === "order.paid"
    ) {
      const entity =
        payload.payload?.subscription?.entity ||
        payload.payload?.order?.entity ||
        payload.payload?.payment?.entity;
      const notes = entity?.notes || {};
      const userId = notes.userId;
      const planTier = (notes.planTier || "PRO") as "PRO" | "BUSINESS";
      const planSpec =
        PRICING_PLANS.find((p) => p.tier === planTier) || PRICING_PLANS[1];

      const supabaseAdmin = getServiceSupabase();
      if (supabaseAdmin && userId) {
        await supabaseAdmin.from("subscriptions").upsert({
          user_id: userId,
          plan_tier: planTier,
          status: "active",
          provider: "razorpay",
          external_subscription_id: String(entity?.id || ""),
          updated_at: new Date().toISOString(),
        });

        await supabaseAdmin
          .from("credit_balances")
          .update({
            balance: planSpec.creditsPerMonth,
            monthly_allowance: planSpec.creditsPerMonth,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }
    }

    return NextResponse.json({ received: true, provider: "razorpay" });
  }

  // 2. Handle Stripe Checkout Webhooks
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret || !webhookSecret) {
    return NextResponse.json(
      { message: "Webhook secret not configured." },
      { status: 400 }
    );
  }

  try {
    const sig = req.headers.get("stripe-signature") || "";
    const stripe = new Stripe(stripeSecret);
    const event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const planTier = (session.metadata?.planTier || "PRO") as
        | "PRO"
        | "BUSINESS";
      const planSpec =
        PRICING_PLANS.find((p) => p.tier === planTier) || PRICING_PLANS[1];

      const supabaseAdmin = getServiceSupabase();
      if (supabaseAdmin && userId) {
        await supabaseAdmin
          .from("subscriptions")
          .upsert({
            user_id: userId,
            plan_tier: planTier,
            status: "active",
            provider: "stripe",
            external_customer_id: String(session.customer || ""),
            external_subscription_id: String(session.subscription || ""),
            updated_at: new Date().toISOString(),
          });

        await supabaseAdmin
          .from("credit_balances")
          .update({
            balance: planSpec.creditsPerMonth,
            monthly_allowance: planSpec.creditsPerMonth,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Webhook signature failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
