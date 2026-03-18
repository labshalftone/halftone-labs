import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";
import { lookupSku } from "@/lib/shopify-skus";

export interface ShopifyLineItem {
  id: number;
  title: string;
  quantity: number;
  sku: string | null;
  variant_title: string | null;
  price: string;
  variant_id: number | null;
}

export interface ShopifyOrder {
  id: number;
  name: string;          // e.g. "#1001"
  email: string | null;
  created_at: string;
  financial_status: string;
  fulfillment_status: string | null;
  total_price: string;
  currency: string;
  line_items: ShopifyLineItem[];
  shipping_address: {
    name: string; address1: string; city: string;
    province: string; country: string; zip: string;
  } | null;
  note: string | null;
}

// GET /api/shopify/orders?userId=...&status=any&limit=50
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const status = req.nextUrl.searchParams.get("status") ?? "any";
  const limit  = req.nextUrl.searchParams.get("limit")  ?? "50";

  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = createAdminClient();

  // Get connection
  const { data: conn, error: connErr } = await db
    .from("shopify_connections")
    .select("shop_domain, access_token")
    .eq("user_id", userId)
    .single();

  if (connErr || !conn) {
    return NextResponse.json({ error: "No Shopify store connected" }, { status: 404 });
  }

  // Fetch orders from Shopify Admin REST API
  const qs = new URLSearchParams({
    status,
    limit,
    fields: "id,name,email,created_at,financial_status,fulfillment_status,total_price,currency,line_items,shipping_address,note",
  });
  const url = `https://${conn.shop_domain}/admin/api/2024-01/orders.json?${qs}`;

  let shopifyOrders: ShopifyOrder[] = [];
  try {
    const res = await fetch(url, {
      headers: { "X-Shopify-Access-Token": conn.access_token },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error("[shopify/orders] fetch failed:", res.status, txt);
      return NextResponse.json({ error: `Shopify API error: ${res.status}` }, { status: 502 });
    }
    const data = await res.json();
    shopifyOrders = data.orders ?? [];
  } catch (e) {
    console.error("[shopify/orders] fetch exception:", e);
    return NextResponse.json({ error: "Failed to reach Shopify" }, { status: 502 });
  }

  // Get confirmed order IDs from our DB
  const { data: confirmed } = await db
    .from("shopify_orders")
    .select("shopify_order_id, status, hl_order_ref, confirmed_at")
    .eq("user_id", userId);

  const confirmedMap: Record<string, { status: string; hl_order_ref: string | null; confirmed_at: string | null }> = {};
  for (const c of confirmed ?? []) {
    confirmedMap[String(c.shopify_order_id)] = c;
  }

  // Get user's custom SKU mappings
  const { data: skuMappings } = await db
    .from("sku_mappings")
    .select("shopify_sku, hl_product_id, hl_product_name, hl_color_name, hl_color_hex, hl_size, hl_gsm, hl_blank_price")
    .eq("user_id", userId);

  const skuMappingMap: Record<string, typeof skuMappings extends null ? never : (typeof skuMappings)[0]> = {};
  for (const m of skuMappings ?? []) {
    skuMappingMap[m.shopify_sku] = m;
  }

  // Enrich each order line item with HL product match
  const enriched = shopifyOrders.map((order) => {
    const hlStatus = confirmedMap[String(order.id)] ?? null;
    const enrichedLines = order.line_items.map((line) => {
      const sku = line.sku ?? "";
      // 1. Try direct SKU catalog match (merchant uses our SKU format)
      let hlProduct = sku ? lookupSku(sku) : null;
      // 2. Try custom mapping
      if (!hlProduct && sku && skuMappingMap[sku]) {
        const m = skuMappingMap[sku];
        hlProduct = {
          sku,
          productId:   m.hl_product_id,
          productName: m.hl_product_name,
          colorName:   m.hl_color_name,
          colorHex:    m.hl_color_hex,
          size:        m.hl_size,
          gsm:         m.hl_gsm,
          blankPrice:  m.hl_blank_price,
        };
      }
      return { ...line, hlProduct: hlProduct ?? null };
    });

    const allMatched = enrichedLines.every((l) => l.hlProduct !== null);
    const anyMatched = enrichedLines.some((l) => l.hlProduct !== null);

    return {
      ...order,
      line_items: enrichedLines,
      hlStatus:   hlStatus?.status ?? null,
      hlOrderRef: hlStatus?.hl_order_ref ?? null,
      confirmedAt: hlStatus?.confirmed_at ?? null,
      allMatched,
      anyMatched,
    };
  });

  return NextResponse.json({ orders: enriched, shopDomain: conn.shop_domain });
}
