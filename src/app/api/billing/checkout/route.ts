import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRICING_PLANS } from "@/lib/constants";
import { PlanTier } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      planTier,
      provider = "stripe",
      userEmail,
      userId,
    }: {
      planTier: PlanTier;
      provider?: "stripe" | "razorpay";
      userEmail?: string;
      userId?: string;
    } = body;

    const plan = PRICING_PLANS.find((p) => p.tier === planTier);
    if (!plan || plan.tier === "FREE") {
      return NextResponse.json(
        { error: "Invalid paid subscription tier selected." },
        { status: 400 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://snapost-ai.breathy.in";

    if (provider === "stripe") {
      const stripeSecret = process.env.STRIPE_SECRET_KEY;
      if (!stripeSecret || stripeSecret.includes("your-")) {
        return NextResponse.json({
          configured: false,
          provider: "stripe",
          message:
            "Payment gateway credentials are not configured in this environment. No live charge was created.",
        });
      }

      const stripe = new Stripe(stripeSecret);
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: userEmail || undefined,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `SnapPost AI — ${plan.name} Plan`,
                description: `${plan.creditsPerMonth} monthly AI credits & premium exports`,
              },
              unit_amount: plan.priceMonthly * 100,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: userId || "",
          planTier: plan.tier,
        },
        success_url: `${appUrl}/dashboard/billing?checkout=success&plan=${plan.tier}`,
        cancel_url: `${appUrl}/dashboard/billing?checkout=cancelled`,
      });

      return NextResponse.json({
        configured: true,
        provider: "stripe",
        checkoutUrl: session.url,
      });
    }

    if (provider === "razorpay") {
      const rzpKeyId = process.env.RAZORPAY_KEY_ID;
      const rzpSecret = process.env.RAZORPAY_KEY_SECRET;
      if (!rzpKeyId || !rzpSecret || rzpKeyId.includes("your-")) {
        return NextResponse.json({
          configured: false,
          provider: "razorpay",
          message:
            "Payment gateway credentials are not configured in this environment. No live payment order was created.",
        });
      }

      const authHeader = Buffer.from(`${rzpKeyId}:${rzpSecret}`).toString(
        "base64"
      );

      // If a recurring Subscription Plan ID is configured in Secret Manager, create a recurring subscription
      const rzpPlanId =
        plan.tier === "PRO"
          ? process.env.RAZORPAY_PRO_PLAN_ID
          : process.env.RAZORPAY_BUSINESS_PLAN_ID;

      if (rzpPlanId && !rzpPlanId.includes("your-")) {
        const subRes = await fetch(
          "https://api.razorpay.com/v1/subscriptions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${authHeader}`,
            },
            body: JSON.stringify({
              plan_id: rzpPlanId,
              total_count: 12,
              quantity: 1,
              customer_notify: 1,
              notes: {
                planTier: plan.tier,
                userId: userId || "",
                userEmail: userEmail || "",
              },
            }),
          }
        );

        if (subRes.ok) {
          const subData = await subRes.json();
          return NextResponse.json({
            configured: true,
            provider: "razorpay",
            subscriptionId: subData.id,
            checkoutUrl: subData.short_url,
            keyId: rzpKeyId,
          });
        }
      }

      const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authHeader}`,
        },
        body: JSON.stringify({
          amount: plan.priceInr * 100,
          currency: "INR",
          receipt: `rcpt_${userId || "user"}_${Date.now()}`,
          notes: {
            planTier: plan.tier,
            userId: userId || "",
          },
        }),
      });

      if (!orderRes.ok) {
        const errText = await orderRes.text();
        return NextResponse.json(
          { error: `Razorpay order creation failed: ${errText}` },
          { status: 500 }
        );
      }

      const orderData = await orderRes.json();
      return NextResponse.json({
        configured: true,
        provider: "razorpay",
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: rzpKeyId,
      });
    }

    return NextResponse.json(
      { error: "Unsupported payment provider." },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Billing checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
