import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET /api/shopify/connect?userId=...
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("shopify_connections")
    .select("id, shop_domain, shop_name, is_active, created_at")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ connection: data ?? null });
}

// POST /api/shopify/connect  — save / update connection
export async function POST(req: NextRequest) {
  const { userId, shopDomain, accessToken } = await req.json();
  if (!userId || !shopDomain || !accessToken) {
    return NextResponse.json({ error: "userId, shopDomain, accessToken required" }, { status: 400 });
  }

  // Normalise domain
  const domain = shopDomain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");

  // Verify the token works by fetching shop info from Shopify
  let shopName: string | null = null;
  try {
    const res = await fetch(`https://${domain}/admin/api/2024-01/shop.json`, {
      headers: { "X-Shopify-Access-Token": accessToken },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error("[shopify/connect] shop verify failed:", res.status, txt);
      return NextResponse.json({ error: "Could not verify Shopify credentials. Check your domain and access token." }, { status: 400 });
    }
    const data = await res.json();
    shopName = data?.shop?.name ?? domain;
  } catch (e) {
    console.error("[shopify/connect] verify exception:", e);
    return NextResponse.json({ error: "Could not reach Shopify. Check your shop domain." }, { status: 400 });
  }

  const db = createAdminClient();
  const { error } = await db.from("shopify_connections").upsert({
    user_id:      userId,
    shop_domain:  domain,
    access_token: accessToken,
    shop_name:    shopName,
    is_active:    true,
    updated_at:   new Date().toISOString(),
  }, { onConflict: "user_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, shopName });
}

// DELETE /api/shopify/connect?userId=...
export async function DELETE(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = createAdminClient();
  const { error } = await db.from("shopify_connections").delete().eq("user_id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
