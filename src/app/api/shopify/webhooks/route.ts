import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase-server";

const API_SECRET = process.env.SHOPIFY_API_SECRET!;

// Verify Shopify webhook HMAC
function verifyWebhookHmac(body: string, hmacHeader: string): boolean {
  const digest = crypto.createHmac("sha256", API_SECRET).update(body, "utf8").digest("base64");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
}

// POST /api/shopify/webhooks — receives Shopify event notifications
export async function POST(req: NextRequest) {
  const hmacHeader = req.headers.get("x-shopify-hmac-sha256") ?? "";
  const shop       = req.headers.get("x-shopify-shop-domain") ?? "";
  const topic      = req.headers.get("x-shopify-topic") ?? "";

  const body = await req.text();

  // Verify authenticity
  if (!verifyWebhookHmac(body, hmacHeader)) {
    console.error(`[shopify/webhook] HMAC verification failed for ${shop}`);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log(`[shopify/webhook] topic=${topic} shop=${shop}`);

  const db = createAdminClient();

  // Look up which user owns this shop
  const { data: conn } = await db
    .from("shopify_connections")
    .select("user_id")
    .eq("shop_domain", shop)
    .single();

  if (!conn?.user_id) {
    console.warn(`[shopify/webhook] no user found for shop ${shop}`);
    return NextResponse.json({ ok: true }); // always 200 to Shopify
  }

  const order = JSON.parse(body);

  if (topic === "orders/create" || topic === "orders/updated") {
    // Upsert the order into shopify_orders with status "pending"
    await db.from("shopify_orders").upsert({
      user_id:             conn.user_id,
      shopify_order_id:    String(order.id),
      shopify_order_number: order.name,
      customer_name:       order.shipping_address?.name ?? order.billing_address?.name ?? null,
      customer_email:      order.email ?? null,
      line_items:          order.line_items ?? [],
      shipping_address:    order.shipping_address ?? null,
      shopify_created_at:  order.created_at,
      updated_at:          new Date().toISOString(),
    }, {
      onConflict:    "user_id,shopify_order_id",
      ignoreDuplicates: false,
    });
    console.log(`[shopify/webhook] upserted order ${order.name} for user ${conn.user_id}`);
  }

  if (topic === "orders/cancelled") {
    await db
      .from("shopify_orders")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("user_id", conn.user_id)
      .eq("shopify_order_id", String(order.id));
    console.log(`[shopify/webhook] cancelled order ${order.name}`);
  }

  // Always respond 200 quickly — Shopify retries if we don't
  return NextResponse.json({ ok: true });
}
