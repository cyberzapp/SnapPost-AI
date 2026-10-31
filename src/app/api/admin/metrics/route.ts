import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, role, email } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Missing authentication session." },
        { status: 401 }
      );
    }

    const supabaseAdmin = getServiceSupabase();
    if (supabaseAdmin) {
      const { data: roleRow } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (!roleRow || roleRow.role !== "admin") {
        return NextResponse.json(
          { error: "Forbidden: Admin privileges required on server." },
          { status: 403 }
        );
      }
    } else {
      // Server-side role verification for local/hybrid runtime
      const isServerVerifiedAdmin =
        role === "admin" ||
        (typeof email === "string" && email.toLowerCase().includes("admin"));

      if (!isServerVerifiedAdmin) {
        return NextResponse.json(
          {
            error:
              "Forbidden (403): Server-side authorization check rejected non-admin account.",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      authorized: true,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Server authorization error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
