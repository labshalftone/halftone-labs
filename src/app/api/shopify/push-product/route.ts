import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

const SHOPIFY_API_VERSION = "2024-01";
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

/** Flatten any Shopify errors object/string into a readable string */
function serializeShopifyErrors(errors: unknown): string {
  if (!errors) return "Unknown Shopify error";
  if (typeof errors === "string") return errors;
  if (typeof errors === "object") {
    return Object.entries(errors as Record<string, unknown>)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
      .join(" | ");
  }
  return String(errors);
}

/** Detect scope / permission errors */
function isScopeError(status: number, errors: unknown) {
  if (status === 403) return true;
  const str = JSON.stringify(errors ?? "").toLowerCase();
  return str.includes("scope") || str.includes("approval") || str.includes("permission") || str.includes("unauthorized");
}

export async function POST(req: NextRequest) {
  try {
    const { userId, designId, retailPrice } = await req.json();

    if (!userId || !designId || !retailPrice) {
      return NextResponse.json({ error: "userId, designId, retailPrice required" }, { status: 400 });
    }

    const db = createAdminClient();

    // 1. Fetch design
    const { data: design, error: dErr } = await db
      .from("designs")
      .select("*")
      .eq("id", designId)
      .eq("user_id", userId)
      .single();

    if (dErr || !design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    // 2. Fetch Shopify connection
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
    const shopifyHeaders = {
      "X-Shopify-Access-Token": access_token,
      "Content-Type": "application/json",
    };

    const baseSku = design.sku || `HLD-${designId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
    const priceStr = Number(retailPrice).toFixed(2);

    // 3. Variants — no fulfillment_service (causes errors on some stores)
    const variants = ALL_SIZES.map((size) => ({
      option1: size,
      price: priceStr,
      sku: `${baseSku}-${size}`,
      inventory_management: null,
    }));

    // 4. Build product payload (no images on first attempt — Shopify must be able to download them)
    const productTitle = design.name || `${design.product_name} – ${design.color_name}`;
    const productBody = [
      `<strong>${design.product_name}</strong>`,
      design.color_name ? `<p>Color: ${design.color_name}</p>` : "",
      design.gsm ? `<p>Weight: ${design.gsm} GSM</p>` : "",
      design.has_design ? `<p>Custom DTG print included.</p>` : "",
    ].filter(Boolean).join("\n");

    const basePayload = {
      title: productTitle,
      body_html: productBody,
      vendor: "Halftone Studio",
      product_type: design.product_name || "Apparel",
      tags: ["halftone", "custom-print", baseSku].filter(Boolean).join(", "),
      options: [{ name: "Size" }],
      variants,
    };

    let shopifyProductId: string | null = design.shopify_product_id ?? null;
    let shopifyUrl: string | null = null;

    if (shopifyProductId) {
      // ── Update existing product ──────────────────────────────────────────────
      const res = await fetch(`${baseUrl}/products/${shopifyProductId}.json`, {
        method: "PUT",
        headers: shopifyHeaders,
        body: JSON.stringify({ product: basePayload }),
      });
      const json = await res.json();
      if (!res.ok) {
        console.error("[push-product] update failed:", json);
        if (isScopeError(res.status, json.errors)) {
          return NextResponse.json({ error: "reauth_required", shopDomain: shop_domain }, { status: 403 });
        }
        return NextResponse.json({ error: serializeShopifyErrors(json.errors) }, { status: 502 });
      }
      shopifyUrl = `https://${shop_domain}/admin/products/${shopifyProductId}`;
    } else {
      // ── Create new product ───────────────────────────────────────────────────
      const res = await fetch(`${baseUrl}/products.json`, {
        method: "POST",
        headers: shopifyHeaders,
        body: JSON.stringify({ product: basePayload }),
      });
      const json = await res.json();
      if (!res.ok || !json.product?.id) {
        console.error("[push-product] create failed:", json);
        if (isScopeError(res.status, json.errors)) {
          return NextResponse.json({ error: "reauth_required", shopDomain: shop_domain }, { status: 403 });
        }
        return NextResponse.json({ error: serializeShopifyErrors(json.errors) }, { status: 502 });
      }
      shopifyProductId = String(json.product.id);
      shopifyUrl = `https://${shop_domain}/admin/products/${shopifyProductId}`;

      // Save product ID to design
      await db.from("designs").update({ shopify_product_id: shopifyProductId }).eq("id", designId);
    }

    // ── Attach images separately (non-blocking — failures don't fail the push) ─
    const imageUrls: { src: string; alt: string }[] = [];
    if (design.thumbnail)      imageUrls.push({ src: design.thumbnail,      alt: `${productTitle} – Front` });
    if (design.back_thumbnail) imageUrls.push({ src: design.back_thumbnail, alt: `${productTitle} – Back` });

    if (imageUrls.length > 0) {
      // Upload images one by one — skip any that fail
      for (const img of imageUrls) {
        try {
          await fetch(`${baseUrl}/products/${shopifyProductId}/images.json`, {
            method: "POST",
            headers: shopifyHeaders,
            body: JSON.stringify({ image: img }),
            signal: AbortSignal.timeout(8000),
          });
        } catch (e) {
          console.warn("[push-product] image attach failed (non-fatal):", e);
        }
      }
    }

    return NextResponse.json({ success: true, shopifyProductId, shopifyUrl });
  } catch (err) {
    console.error("[push-product] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
