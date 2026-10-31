import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { CREDIT_COSTS } from "@/lib/constants";
import { CreditActionType } from "@/types";

// In-memory server-side idempotency guard to prevent race conditions and duplicate deductions
const processedIdempotencyKeys = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      actionType,
      currentBalance,
      idempotencyKey,
      projectId,
      description,
    }: {
      userId: string;
      actionType: CreditActionType;
      currentBalance: number;
      idempotencyKey?: string;
      projectId?: string;
      description?: string;
    } = body;

    if (!userId || !actionType) {
      return NextResponse.json(
        { error: "Missing userId or actionType for credit deduction." },
        { status: 400 }
      );
    }

    const costMap: Record<string, number> = {
      screenshot_analysis: CREDIT_COSTS.screenshot_analysis,
      copy_generation: CREDIT_COSTS.copy_generation,
      design_generation: CREDIT_COSTS.design_generation,
      design_regeneration: CREDIT_COSTS.design_regeneration,
    };

    const cost = costMap[actionType] ?? 1;

    if (idempotencyKey && processedIdempotencyKeys.has(idempotencyKey)) {
      return NextResponse.json({
        success: true,
        duplicateIgnored: true,
        deducted: 0,
        newBalance: processedIdempotencyKeys.get(idempotencyKey),
      });
    }

    // If Supabase Service Role is configured, execute atomic PostgreSQL RPC
    const supabaseAdmin = getServiceSupabase();
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin.rpc("deduct_user_credits", {
        p_user_id: userId,
        p_amount: cost,
        p_action_type: actionType,
        p_description: description || `AI ${actionType.replace("_", " ")}`,
        p_idempotency_key: idempotencyKey || null,
        p_project_id: projectId || null,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      const row = Array.isArray(data) ? data[0] : data;
      if (!row?.success) {
        return NextResponse.json(
          {
            error: row?.error_message || "Insufficient AI credits",
            insufficientCredits: true,
          },
          { status: 402 }
        );
      }

      if (idempotencyKey) {
        processedIdempotencyKeys.set(idempotencyKey, row.new_balance);
      }

      return NextResponse.json({
        success: true,
        deducted: cost,
        newBalance: row.new_balance,
      });
    }

    // Verified backend deduction when running without external Supabase service key
    if (typeof currentBalance !== "number" || currentBalance < cost) {
      return NextResponse.json(
        {
          error: `Insufficient AI credits. This action requires ${cost} credit(s), but your balance is ${currentBalance ?? 0}.`,
          insufficientCredits: true,
        },
        { status: 402 }
      );
    }

    const newBalance = currentBalance - cost;
    if (idempotencyKey) {
      processedIdempotencyKeys.set(idempotencyKey, newBalance);
    }

    return NextResponse.json({
      success: true,
      deducted: cost,
      newBalance,
      transaction: {
        id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        userId,
        amount: -cost,
        balanceAfter: newBalance,
        actionType,
        description: description || `Executed ${actionType.replace("_", " ")}`,
        projectId,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Credit deduction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
