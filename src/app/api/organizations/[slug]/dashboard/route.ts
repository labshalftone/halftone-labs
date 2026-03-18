import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

type StoreStats = {
  id: string;
  handle: string;
  artistName: string;
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
};

// GET /api/organizations/[slug]/dashboard?userId=...
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = createAdminClient();

  // 1. Get org + verify access
  const { data: org } = await db
    .from("organizations")
    .select("id, slug, name, logo_url, description, owner_id")
    .eq("slug", slug)
    .maybeSingle();
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: membership } = await db
    .from("organization_members")
    .select("role")
    .eq("org_id", org.id)
    .eq("user_id", userId)
    .maybeSingle();
  if (!membership && org.owner_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Get all stores linked to this org
  const { data: stores } = await db
    .from("artist_stores")
    .select("id, handle, artist_name, user_id")
    .eq("organization_id", org.id);

  const allStores = stores ?? [];

  // 3. For each store, compute revenue and orders from store_orders
  const storeStats: StoreStats[] = await Promise.all(
    allStores.map(async (store) => {
      const { data: orders } = await db
        .from("store_orders")
        .select("id, total_inr, status")
        .eq("store_id", store.id);

      const storeOrders = orders ?? [];
      const totalRevenue = storeOrders
        .filter((o) => !["cancelled", "Cancelled"].includes(o.status))
        .reduce((sum, o) => sum + Number(o.total_inr ?? 0), 0);
      const pendingOrders = storeOrders.filter((o) =>
        ["Order Placed", "In Production", "Quality Check"].includes(o.status)
      ).length;

      return {
        id: store.id,
        handle: store.handle,
        artistName: store.artist_name,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders: storeOrders.length,
        pendingOrders,
      };
    })
  );

  // 4. Get members
  const { data: members } = await db
    .from("organization_members")
    .select("user_id, role, created_at")
    .eq("org_id", org.id);

  // 5. Aggregate totals
  const totalRevenue = storeStats.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalOrders  = storeStats.reduce((sum, s) => sum + s.totalOrders, 0);
  const activeDrops  = 0; // placeholder — extend when drops table is linked to orgs

  // 6. Best performing store
  const bestStore = storeStats.sort((a, b) => b.totalRevenue - a.totalRevenue)[0] ?? null;

  return NextResponse.json({
    org: { id: org.id, slug: org.slug, name: org.name, logo_url: org.logo_url, description: org.description },
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders,
    activeDrops,
    storeCount: allStores.length,
    memberCount: (members ?? []).length,
    bestStore: bestStore?.artistName ?? null,
    stores: storeStats,
    members: members ?? [],
  });
}
