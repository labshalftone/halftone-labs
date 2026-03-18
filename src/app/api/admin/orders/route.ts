import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("orders")
    .select("*, milestones(id, title, description, created_at)")
    .order("created_at", { ascending: false })
    .order("created_at", { referencedTable: "milestones", ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const orders = data ?? [];

  // Collect unique user_ids from orders that have them
  const userIds = [...new Set(orders.map((o) => o.user_id).filter(Boolean))] as string[];

  if (userIds.length === 0) return NextResponse.json(orders);

  // Fetch profiles + shopify connections in parallel
  const [profilesRes, shopifyRes] = await Promise.all([
    db.from("user_profiles")
      .select("user_id, customer_email, name, company_name")
      .in("user_id", userIds),
    db.from("shopify_connections")
      .select("user_id, shop_domain, shop_name, is_active")
      .in("user_id", userIds),
  ]);

  const profileMap: Record<string, { email: string | null; name: string | null; company: string | null }> = {};
  for (const p of profilesRes.data ?? []) {
    if (p.user_id) profileMap[p.user_id] = { email: p.customer_email, name: p.name, company: p.company_name };
  }

  const shopifyMap: Record<string, { shop_domain: string; shop_name: string | null }> = {};
  for (const s of shopifyRes.data ?? []) {
    if (s.user_id) shopifyMap[s.user_id] = { shop_domain: s.shop_domain, shop_name: s.shop_name };
  }

  // Enrich each order
  const enriched = orders.map((o) => {
    if (!o.user_id) return o;
    const profile = profileMap[o.user_id];
    const shopify = shopifyMap[o.user_id];
    return {
      ...o,
      merchant_name:   profile?.name    ?? profile?.company ?? profile?.email ?? null,
      merchant_email:  profile?.email   ?? null,
      shopify_domain:  shopify?.shop_domain ?? null,
      shopify_store_name: shopify?.shop_name ?? null,
      is_shopify_order: o.ref?.startsWith("HLSFY-") ?? false,
    };
  });

  return NextResponse.json(enriched);
}
