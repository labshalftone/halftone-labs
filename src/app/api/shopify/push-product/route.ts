import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

const SHOPIFY_API_VERSION = "2024-01";

// Sizes we create variants for
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

// POST /api/shopify/push-product
// Body: { userId, designId, retailPrice }
export async function POST(req: NextRequest) {
  try {
    const { userId, designId, retailPrice } = await req.json();

    if (!userId || !designId || !retailPrice) {
      return NextResponse.json({ error: "userId, designId, retailPrice required" }, { status: 400 });
    }

    const db = createAdminClient();

    // 1. Fetch the design
    const { data: design, error: dErr } = await db
      .from("designs")
      .select("*")
      .eq("id", designId)
      .eq("user_id", userId)
      .single();

    if (dErr || !design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    // 2. Fetch Shopify connection for this user
    const { data: conn, error: cErr } = await db
      .from("shopify_connections")
      .select("shop_domain, access_token")
      .eq("user_id", userId)
      .single();

    if (cErr || !conn) {
      return NextResponse.json({ error: "No Shopify store connected" }, { status: 404 });
    }

    const { shop_domain, access_token } = conn;
    const baseUrl = `https://${shop_domain}/admin/api/${SHOPIFY_API_VERSION}`;
    const headers = {
      "X-Shopify-Access-Token": access_token,
      "Content-Type": "application/json",
    };

    const baseSku = design.sku || `HLD-${designId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

    // 3. Build variants — one per size, each with a unique SKU
    const variants = ALL_SIZES.map((size) => ({
      option1: size,
      price: String(Number(retailPrice).toFixed(2)),
      sku: `${baseSku}-${size}`,
      inventory_management: null, // don't manage inventory via Shopify
      fulfillment_service: "manual",
    }));

    // 4. Build product payload
    const productTitle = design.name || `${design.product_name} – ${design.color_name}`;
    const productBody = [
      `<strong>${design.product_name}</strong>`,
      design.color_name ? `<p>Color: ${design.color_name}</p>` : "",
      design.gsm ? `<p>Weight: ${design.gsm} GSM</p>` : "",
      design.has_design ? `<p>Custom DTG Print included.</p>` : "",
    ].filter(Boolean).join("\n");

    // 5. Images — use thumbnail(s) if available
    const images: { src: string; alt: string }[] = [];
    if (design.thumbnail) images.push({ src: design.thumbnail, alt: `${productTitle} – Front` });
    if (design.back_thumbnail) images.push({ src: design.back_thumbnail, alt: `${productTitle} – Back` });

    const productPayload = {
      product: {
        title: productTitle,
        body_html: productBody,
        vendor: "Halftone Studio",
        product_type: design.product_name || "Apparel",
        tags: ["halftone", "custom-print", baseSku].filter(Boolean),
        options: [{ name: "Size" }],
        variants,
        ...(images.length > 0 ? { images } : {}),
      },
    };

    // 6. If already pushed, update; otherwise create
    let shopifyProductId: string | null = design.shopify_product_id ?? null;
    let shopifyUrl: string | null = null;

    // Helper: detect if a Shopify error response is a scope/permission issue
    const isScopeError = (status: number, errors: unknown) => {
      if (status === 403) return true;
      const str = JSON.stringify(errors ?? "").toLowerCase();
      return str.includes("scope") || str.includes("approval") || str.includes("permission") || str.includes("unauthorized");
    };

    if (shopifyProductId) {
      // Update existing product
      const res = await fetch(`${baseUrl}/products/${shopifyProductId}.json`, {
        method: "PUT",
        headers,
        body: JSON.stringify(productPayload),
      });
      const json = await res.json();
      if (!res.ok) {
        console.error("[push-product] update failed:", json);
        if (isScopeError(res.status, json.errors)) {
          return NextResponse.json({ error: "reauth_required", shopDomain: shop_domain }, { status: 403 });
        }
        return NextResponse.json({ error: json.errors || "Shopify update failed" }, { status: 502 });
      }
      shopifyUrl = `https://${shop_domain}/admin/products/${shopifyProductId}`;
    } else {
      // Create new product
      const res = await fetch(`${baseUrl}/products.json`, {
        method: "POST",
        headers,
        body: JSON.stringify(productPayload),
      });
      const json = await res.json();
      if (!res.ok || !json.product?.id) {
        console.error("[push-product] create failed:", json);
        if (isScopeError(res.status, json.errors)) {
          return NextResponse.json({ error: "reauth_required", shopDomain: shop_domain }, { status: 403 });
        }
        return NextResponse.json({ error: json.errors || "Shopify create failed" }, { status: 502 });
      }
      shopifyProductId = String(json.product.id);
      shopifyUrl = `https://${shop_domain}/admin/products/${shopifyProductId}`;

      // Save Shopify product ID back to design
      await db
        .from("designs")
        .update({ shopify_product_id: shopifyProductId })
        .eq("id", designId);
    }

    return NextResponse.json({ success: true, shopifyProductId, shopifyUrl });
  } catch (err) {
    console.error("[push-product] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
