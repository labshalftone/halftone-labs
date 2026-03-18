import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET /api/stores/payout-stats?userId=...
// Returns: { totalEarned, pendingPayout, nextPayoutDate, lastPayoutDate, payoutHistory }
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = createAdminClient();

  // Get the user's store handle
  const { data: store } = await db
    .from("artist_stores")
    .select("id, handle, artist_name")
    .eq("user_id", userId)
    .maybeSingle();

  if (!store) {
    return NextResponse.json({
      totalEarned: 0,
      pendingPayout: 0,
      nextPayoutDate: getNextPayoutDate(),
      lastPayoutDate: null,
      payoutHistory: [],
    });
  }

  // Get all store orders for this store
  const { data: orders } = await db
    .from("store_orders")
    .select("id, total_inr, platform_fee_inr, status, created_at, paid_out_at")
    .eq("store_id", store.id)
    .order("created_at", { ascending: false });

  const allOrders = orders ?? [];

  // Total earned = sum of (total_inr - platform_fee_inr) for delivered/shipped orders
  const totalEarned = allOrders
    .filter((o) => ["delivered", "shipped", "Delivered", "Shipped"].includes(o.status))
    .reduce((sum, o) => sum + (Number(o.total_inr ?? 0) - Number(o.platform_fee_inr ?? 0)), 0);

  // Pending payout = earned but not yet paid out
  const pendingPayout = allOrders
    .filter((o) => ["delivered", "shipped", "Delivered", "Shipped"].includes(o.status) && !o.paid_out_at)
    .reduce((sum, o) => sum + (Number(o.total_inr ?? 0) - Number(o.platform_fee_inr ?? 0)), 0);

  // Payout history from payout_requests table (if it exists)
  const { data: payouts } = await db
    .from("payout_requests")
    .select("id, amount, status, created_at, paid_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  return NextResponse.json({
    totalEarned: Math.round(totalEarned * 100) / 100,
    pendingPayout: Math.round(pendingPayout * 100) / 100,
    nextPayoutDate: getNextPayoutDate(),
    lastPayoutDate: payouts?.[0]?.paid_at ?? null,
    payoutHistory: payouts ?? [],
  });
}

function getNextPayoutDate(): string {
  const now = new Date();
  // Payouts happen on the 15th and last day of each month
  const day = now.getDate();
  let nextPayout: Date;
  if (day < 15) {
    nextPayout = new Date(now.getFullYear(), now.getMonth(), 15);
  } else {
    // Last day of this month
    nextPayout = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }
  return nextPayout.toISOString().split("T")[0];
}
