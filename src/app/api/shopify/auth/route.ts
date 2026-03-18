import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const API_KEY     = process.env.SHOPIFY_API_KEY!;
const SCOPES      = process.env.SHOPIFY_SCOPES ?? "read_orders,write_fulfillments,write_products";
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://halftonelabs.in"}/api/shopify/callback`;

// GET /api/shopify/auth?shop=store.myshopify.com&userId=...
export async function GET(req: NextRequest) {
  const shop   = req.nextUrl.searchParams.get("shop")?.trim().toLowerCase();
  const userId = req.nextUrl.searchParams.get("userId") ?? "";

  if (!shop) {
    return NextResponse.json({ error: "shop param required" }, { status: 400 });
  }

  // Validate shop domain
  if (!/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/.test(shop)) {
    return NextResponse.json({ error: "Invalid shop domain. Must be *.myshopify.com" }, { status: 400 });
  }

  // nonce encodes userId so we can recover it in the callback
  const nonce = `${crypto.randomBytes(8).toString("hex")}.${Buffer.from(userId).toString("base64url")}`;

  const authUrl = new URL(`https://${shop}/admin/oauth/authorize`);
  authUrl.searchParams.set("client_id",    API_KEY);
  authUrl.searchParams.set("scope",        SCOPES);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("state",        nonce);

  const response = NextResponse.redirect(authUrl.toString());

  // Store nonce in a short-lived cookie for CSRF verification
  response.cookies.set("shopify_oauth_state", nonce, {
    httpOnly: true,
    secure:   true,
    sameSite: "lax",
    maxAge:   600, // 10 minutes
    path:     "/",
  });

  return response;
}
