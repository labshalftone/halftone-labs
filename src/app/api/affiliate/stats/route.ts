import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Fetch affiliate record
    const { data: affiliate, error: affError } = await supabase
      .from("affiliates")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (affError) {
      return NextResponse.json({ error: affError.message }, { status: 500 });
    }

    if (!affiliate) {
      return NextResponse.json({ affiliate: null, referrals: [] });
    }

    // Fetch referrals
    const { data: referrals, error: refError } = await supabase
      .from("affiliate_referrals")
      .select("*")
      .eq("affiliate_id", affiliate.id)
      .order("created_at", { ascending: false });

    if (refError) {
      return NextResponse.json({ error: refError.message }, { status: 500 });
    }

    const rows = referrals ?? [];

    const totalEarnings = rows.reduce(
      (sum, r) => sum + Number(r.commission ?? 0),
      0
    );
    const pendingEarnings = rows
      .filter((r) => r.status === "pending")
      .reduce((sum, r) => sum + Number(r.commission ?? 0), 0);
    const paidEarnings = rows
      .filter((r) => r.status === "paid")
      .reduce((sum, r) => sum + Number(r.commission ?? 0), 0);

    return NextResponse.json({
      affiliate,
      referrals: rows,
      totalClicks: affiliate.total_clicks ?? 0,
      totalEarnings,
      pendingEarnings,
      paidEarnings,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
