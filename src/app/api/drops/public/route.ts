import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET /api/drops/public?storeHandle=...&slug=...
// Public endpoint — no auth needed. Returns drop + products for storefront rendering.
export async function GET(req: NextRequest) {
  const storeHandle = req.nextUrl.searchParams.get("storeHandle");
  const slug        = req.nextUrl.searchParams.get("slug");

  if (!storeHandle || !slug) {
    return NextResponse.json({ error: "storeHandle and slug required" }, { status: 400 });
  }

  const db = createAdminClient();

  // Resolve store
  const { data: store } = await db
    .from("artist_stores")
    .select("id, handle, artist_name")
    .eq("handle", storeHandle)
    .maybeSingle();

  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

  // Fetch drop
  const { data: drop } = await db
    .from("drops")
    .select("*")
    .eq("store_id", store.id)
    .eq("slug", slug)
    .maybeSingle();

  if (!drop) return NextResponse.json({ error: "Drop not found" }, { status: 404 });

  // Don't serve draft drops publicly
  if (drop.status === "draft") return NextResponse.json({ error: "Not published" }, { status: 404 });

  // Fetch drop products with design info
  const { data: dropProducts } = await db
    .from("drop_products")
    .select("*, designs(id, name, product_name, color_name, thumbnail, front_design_url, back_design_url)")
    .eq("drop_id", drop.id)
    .order("sort_order", { ascending: true });

  return NextResponse.json({ drop, store, products: dropProducts ?? [] });
}
