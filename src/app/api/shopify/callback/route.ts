import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase-server";

const API_KEY    = process.env.SHOPIFY_API_KEY!;
const API_SECRET = process.env.SHOPIFY_API_SECRET!;
const APP_URL    = process.env.NEXT_PUBLIC_APP_URL ?? "https://halftonelabs.in";

// Verify Shopify HMAC signature
function verifyHmac(params: URLSearchParams, secret: string): boolean {
  const hmac = params.get("hmac") ?? "";
  const pairs: string[] = [];
  params.forEach((value, key) => {
    if (key !== "hmac" && key !== "signature") {
      pairs.push(`${key}=${value}`);
    }
  });
  pairs.sort();
  const message = pairs.join("&");
  const digest  = crypto.createHmac("sha256", secret).update(message).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac));
}

// GET /api/shopify/callback  — Shopify redirects here after merchant approves
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const shop   = params.get("shop") ?? "";
  const code   = params.get("code") ?? "";
  const state  = params.get("state") ?? "";

  // 1. Verify HMAC
  if (!verifyHmac(params, API_SECRET)) {
    console.error("[shopify/callback] HMAC verification failed");
    return NextResponse.redirect(`${APP_URL}/account?shopify=error&msg=invalid_hmac`);
  }

  // 2. Verify state (CSRF)
  const storedState = req.cookies.get("shopify_oauth_state")?.value;
  if (!storedState || storedState !== state) {
    console.error("[shopify/callback] state mismatch");
    return NextResponse.redirect(`${APP_URL}/account?shopify=error&msg=state_mismatch`);
  }

  // 3. Decode userId from state (format: "{nonce}.{base64url(userId)}")
  const stateParts = state.split(".");
  const userId = stateParts.length >= 2
    ? Buffer.from(stateParts[stateParts.length - 1], "base64url").toString("utf8")
    : null;

  // 4. Exchange code for permanent access token
  let accessToken: string;
  try {
    const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ client_id: API_KEY, client_secret: API_SECRET, code }),
    });
    const data = await res.json();
    if (!data.access_token) {
      console.error("[shopify/callback] no access_token in response:", data);
      return NextResponse.redirect(`${APP_URL}/account?shopify=error&msg=no_token`);
    }
    accessToken = data.access_token;
  } catch (e) {
    console.error("[shopify/callback] token exchange exception:", e);
    return NextResponse.redirect(`${APP_URL}/account?shopify=error&msg=token_exchange_failed`);
  }

  // 5. Fetch shop name
  let shopName = shop;
  try {
    const res  = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
      headers: { "X-Shopify-Access-Token": accessToken },
    });
    const data = await res.json();
    shopName   = data?.shop?.name ?? shop;
  } catch {}

  // 6. Save connection to DB
  const db = createAdminClient();
  const { error } = await db.from("shopify_connections").upsert({
    user_id:      userId ?? null,
    shop_domain:  shop,
    access_token: accessToken,
    shop_name:    shopName,
    is_active:    true,
    updated_at:   new Date().toISOString(),
  }, { onConflict: "user_id" });

  if (error) {
    console.error("[shopify/callback] DB upsert error:", error.message);
    return NextResponse.redirect(`${APP_URL}/account?shopify=error&msg=db_error`);
  }

  // 7. Register orders/create webhook
  try {
    await fetch(`https://${shop}/admin/api/2024-01/webhooks.json`, {
      method:  "POST",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        webhook: {
          topic:   "orders/create",
          address: `${APP_URL}/api/shopify/webhooks`,
          format:  "json",
        },
      }),
    });
    console.log(`[shopify/callback] webhook registered for ${shop}`);
  } catch (e) {
    console.warn("[shopify/callback] webhook registration failed (non-fatal):", e);
  }

  // 8. Clear OAuth cookie and redirect back to dashboard
  const response = NextResponse.redirect(`${APP_URL}/account?tab=shopify&shopify=connected`);
  response.cookies.delete("shopify_oauth_state");
  return response;
}
