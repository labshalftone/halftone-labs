import { NextRequest, NextResponse } from "next/server";

// Map Vercel geo country code → preferred currency
function countryToCurrency(country: string | null): string {
  if (!country) return "INR";
  if (country === "IN") return "INR";
  if (["US", "CA", "AU", "NZ", "SG", "AE", "PH", "MY"].includes(country)) return "USD";
  if (
    ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "PT", "FI", "IE", "PL", "SE", "DK", "NO"].includes(
      country
    )
  )
    return "EUR";
  return "USD"; // all other countries → USD
}

export function proxy(req: NextRequest) {
  const res = NextResponse.next();

  // Only set if the user hasn't already chosen a currency
  const existing = req.cookies.get("hl_currency");
  if (!existing) {
    const country = req.headers.get("x-vercel-ip-country");
    const currency = countryToCurrency(country);
    res.cookies.set("hl_currency", currency, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|api/).*)",
  ],
};
