import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";
import { getEntitlements, type PlanKey } from "@/lib/plans";

export interface BillingUsage {
  plan:                   PlanKey;
  status:                 string;
  billing:                string | null;
  razorpaySubscriptionId: string | null;
  usage: {
    activeDrops:   number;
    storefronts:   number;
    teamMembers:   number;
    designs:       number;
  };
  limits: {
    activeDrops:   number;
    storefronts:   number;
    teamMembers:   number;
    designs:       number;
  };
}

export async function GET(req: NextRequest) {
  try {
    const db = createAdminClient();

    // Get userId from auth header or query param
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    // Current subscription
    const { data: sub } = await db
      .from("subscriptions")
      .select("plan, status, billing, razorpay_subscription_id")
      .eq("user_id", userId)
      .in("status", ["active", "cancelled"])
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const plan = (sub?.plan ?? "free") as PlanKey;
    const entitlements = getEntitlements(plan);

    // Usage counts — wrapped in try/catch so missing tables don't break billing
    let activeDrops = 0;
    let storefronts = 0;
    let teamMembers = 0;
    let designs     = 0;

    try {
      const { count } = await db
        .from("drops")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "active");
      activeDrops = count ?? 0;
    } catch { /* table may not exist yet */ }

    try {
      const { count } = await db
        .from("stores")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      storefronts = count ?? 0;
    } catch { /* table may not exist yet */ }

    try {
      const { count } = await db
        .from("org_members")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", userId);
      teamMembers = count ?? 0;
    } catch { /* table may not exist yet */ }

    try {
      const { count } = await db
        .from("designs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      designs = count ?? 0;
    } catch { /* table may not exist yet */ }

    const limits = {
      activeDrops:   entitlements.activeDrops,
      storefronts:   entitlements.storefronts,
      teamMembers:   entitlements.teamMembers,
      designs:       entitlements.designs,
    };

    const result: BillingUsage = {
      plan,
      status:                 sub?.status ?? "none",
      billing:                sub?.billing ?? null,
      razorpaySubscriptionId: sub?.razorpay_subscription_id ?? null,
      usage:  { activeDrops, storefronts, teamMembers, designs },
      limits,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[billing/usage] error:", err);
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
}
