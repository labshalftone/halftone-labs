// No new tables needed — uses existing orders, designs, wallets, shopify_connections

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = createAdminClient();

  // Today's UTC date range
  const now = new Date();
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const todayEnd   = new Date(todayStart.getTime() + 86400000);

  // Run all queries in parallel
  const [
    allOrdersRes,
    todayOrdersRes,
    walletRes,
    shopifyRes,
    recentOrdersRes,
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
  ]);

  const allOrders = allOrdersRes.data ?? [];
  const todayOrders = todayOrdersRes.data ?? [];

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

  // Best seller: group by product_name
  const productCounts: Record<string, number> = {};
  for (const o of allOrders) {
    if (o.product_name) {
      productCounts[o.product_name] = (productCounts[o.product_name] ?? 0) + 1;
    }
  }
  const bestSeller = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return NextResponse.json({
    totalRevenue,
    totalOrders,
    todayOrders: todayOrderCount,
    todayRevenue,
    bestSeller,
    walletBalance: walletRes.data?.balance ?? 0,
    walletCurrency: walletRes.data?.currency ?? "INR",
    shopifyConnected: !!shopifyRes.data,
    recentOrders: recentOrdersRes.data ?? [],
  });
}
