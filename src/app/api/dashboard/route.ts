// No new tables needed — uses existing orders, designs, wallets, shopify_connections

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = createAdminClient();

  // Date ranges
  const now = new Date();
  const todayStart   = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const todayEnd     = new Date(todayStart.getTime() + 86400000);
  const sevenDaysAgo = new Date(todayStart.getTime() - 6 * 86400000);

  // Run all queries in parallel
  const [
    allOrdersRes,
    todayOrdersRes,
    walletRes,
    shopifyRes,
    recentOrdersRes,
    weeklyOrdersRes,
  ] = await Promise.all([
    db.from("orders")
      .select("id, total, status, product_name")
      .eq("user_id", userId),
    db.from("orders")
      .select("id, total, status")
      .eq("user_id", userId)
      .gte("created_at", todayStart.toISOString())
      .lt("created_at", todayEnd.toISOString()),
    db.from("wallets")
      .select("balance, currency")
      .eq("user_id", userId)
      .maybeSingle(),
    db.from("shopify_connections")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle(),
    db.from("orders")
      .select("id, ref, product_name, color, size, total, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    db.from("orders")
      .select("created_at, total, status")
      .eq("user_id", userId)
      .gte("created_at", sevenDaysAgo.toISOString())
      .lt("created_at", todayEnd.toISOString()),
  ]);

  const allOrders    = allOrdersRes.data ?? [];
  const todayOrders  = todayOrdersRes.data ?? [];
  const weeklyOrders = weeklyOrdersRes.data ?? [];

  // Total revenue (exclude Cancelled)
  const totalRevenue = allOrders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total ?? 0), 0);

  const totalOrders = allOrders.length;

  // Today metrics
  const todayOrderCount = todayOrders.length;
  const todayRevenue = todayOrders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total ?? 0), 0);

  // Pending orders (awaiting fulfillment)
  const pendingOrders = allOrders.filter(
    (o) => ["Order Placed", "Design Confirmed"].includes(o.status)
  ).length;

  // Best seller: group by product_name
  const productCounts: Record<string, number> = {};
  for (const o of allOrders) {
    if (o.product_name) {
      productCounts[o.product_name] = (productCounts[o.product_name] ?? 0) + 1;
    }
  }
  const bestSeller = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  // Weekly revenue — bucket into 7 daily slots (index 0 = 6 days ago, index 6 = today)
  const weeklyRevenue: number[] = Array(7).fill(0);
  for (const o of weeklyOrders) {
    if (o.status === "Cancelled") continue;
    const orderDate = new Date(o.created_at);
    const dayIndex = Math.floor(
      (orderDate.getTime() - sevenDaysAgo.getTime()) / 86400000
    );
    if (dayIndex >= 0 && dayIndex < 7) {
      weeklyRevenue[dayIndex] += Number(o.total ?? 0);
    }
  }

  return NextResponse.json({
    totalRevenue,
    totalOrders,
    todayOrders: todayOrderCount,
    todayRevenue,
    pendingOrders,
    bestSeller,
    walletBalance:    walletRes.data?.balance ?? 0,
    walletCurrency:   walletRes.data?.currency ?? "INR",
    shopifyConnected: !!shopifyRes.data,
    recentOrders:     recentOrdersRes.data ?? [],
    weeklyRevenue,
  });
}
