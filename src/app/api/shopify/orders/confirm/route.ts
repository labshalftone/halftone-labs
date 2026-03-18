import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// POST /api/shopify/orders/confirm
// Body: { userId, shopifyOrderId, shopifyOrderNumber, lineItems, shippingAddress, customerEmail }
export async function POST(req: NextRequest) {
  const {
    userId, shopifyOrderId, shopifyOrderNumber,
    lineItems, shippingAddress, customerEmail, customerName,
  } = await req.json();

  if (!userId || !shopifyOrderId) {
    return NextResponse.json({ error: "userId and shopifyOrderId required" }, { status: 400 });
  }

  const db = createAdminClient();

  // Generate HL order reference for this Shopify order
  const hlOrderRef = `HLSFY-${shopifyOrderNumber?.replace("#", "") ?? Date.now()}`;

  const { error } = await db.from("shopify_orders").upsert({
    user_id:            userId,
    shopify_order_id:   String(shopifyOrderId),
    shopify_order_number: shopifyOrderNumber,
    customer_name:      customerName ?? null,
    customer_email:     customerEmail ?? null,
    line_items:         lineItems,
    shipping_address:   shippingAddress ?? null,
    status:             "confirmed",
    confirmed_at:       new Date().toISOString(),
    hl_order_ref:       hlOrderRef,
    updated_at:         new Date().toISOString(),
  }, { onConflict: "user_id,shopify_order_id" });

  if (error) {
    console.error("[shopify/confirm] DB error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, hlOrderRef });
}
