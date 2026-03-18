import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET /api/drops/stats?dropId=...&userId=...
export async function GET(req: NextRequest) {
  const dropId = req.nextUrl.searchParams.get("dropId");
  const userId = req.nextUrl.searchParams.get("userId");
  if (!dropId || !userId) return NextResponse.json({ error: "dropId and userId required" }, { status: 400 });

  const db = createAdminClient();

  const [dropResult, waitlistResult, ordersResult] = await Promise.all([
    db.from("drops").select("id, title, status, launch_at, store_id").eq("id", dropId).eq("user_id", userId).maybeSingle(),
    db.from("drop_waitlist_signups").select("id, created_at").eq("drop_id", dropId),
    // Orders linked to this drop via store_id — approximate by matching store orders after launch_at
    db.from("store_orders").select("id, total_inr, status, created_at").eq("drop_id", dropId),
  ]);

  const drop = dropResult.data;
  if (!drop) return NextResponse.json({ error: "Drop not found or unauthorized" }, { status: 404 });

  const waitlistSignups = waitlistResult.data ?? [];
  const orders = ordersResult.data ?? [];

  const revenue = orders
    .filter((o) => !["cancelled", "Cancelled"].includes(o.status))
    .reduce((sum, o) => sum + Number(o.total_inr ?? 0), 0);

  return NextResponse.json({
    dropId,
    title: drop.title,
    status: drop.status,
    waitlistCount: waitlistSignups.length,
    orderCount: orders.length,
    revenue: Math.round(revenue * 100) / 100,
    conversionRate: waitlistSignups.length > 0
      ? Math.round((orders.length / waitlistSignups.length) * 100)
      : null,
  });
}
