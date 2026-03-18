import { NextRequest, NextResponse } from "next/server";

const PICKUP_PIN = "201304";

// Fixed international rates (Shiprocket DHL/Aramex + 28% margin, 0.5kg from Noida)
const INTL: Record<string, { label: string; carrier: string; rate: number; days: string }> = {
  US: { label: "United States",  carrier: "DHL Express", rate: 1599, days: "7–10 business days" },
  CA: { label: "Canada",         carrier: "DHL Express", rate: 1899, days: "7–12 business days" },
  GB: { label: "United Kingdom", carrier: "DHL Express", rate: 1399, days: "5–8 business days" },
  DE: { label: "Germany",        carrier: "DHL Express", rate: 1499, days: "6–9 business days" },
  FR: { label: "France",         carrier: "DHL Express", rate: 1499, days: "6–9 business days" },
  NL: { label: "Netherlands",    carrier: "DHL Express", rate: 1499, days: "6–9 business days" },
  IT: { label: "Italy",          carrier: "DHL Express", rate: 1499, days: "6–9 business days" },
  ES: { label: "Spain",          carrier: "DHL Express", rate: 1499, days: "6–9 business days" },
  AU: { label: "Australia",      carrier: "DHL Express", rate: 1799, days: "8–12 business days" },
  SG: { label: "Singapore",      carrier: "DHL Express", rate: 849,  days: "3–5 business days" },
  TH: { label: "Thailand",       carrier: "DHL Express", rate: 899,  days: "4–7 business days" },
  AE: { label: "UAE",            carrier: "DHL Express", rate: 999,  days: "4–6 business days" },
  JP: { label: "Japan",          carrier: "DHL Express", rate: 1299, days: "5–8 business days" },
  NZ: { label: "New Zealand",    carrier: "DHL Express", rate: 1899, days: "9–14 business days" },
};

let _token: string | null = null;
let _tokenExpiry = 0;

async function getShiprocketToken(): Promise<string | null> {
  if (_token && Date.now() < _tokenExpiry) {
    console.log("[shiprocket] using cached token");
    return _token;
  }
  const email = process.env.SHIPROCKET_EMAIL;
  const pass  = process.env.SHIPROCKET_PASSWORD;
  if (!email || !pass) {
    console.error("[shiprocket] SHIPROCKET_EMAIL or SHIPROCKET_PASSWORD env var not set");
    return null;
  }
  console.log(`[shiprocket] logging in as ${email}`);
  try {
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }),
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(`[shiprocket] login failed (${res.status}):`, JSON.stringify(data));
      return null;
    }
    if (!data.token) {
      console.error("[shiprocket] login OK but no token in response:", JSON.stringify(data));
      return null;
    }
    _token = data.token;
    _tokenExpiry = Date.now() + 23 * 3_600_000;
    console.log("[shiprocket] login successful, token cached for 23h");
    return _token;
  } catch (e) {
    console.error("[shiprocket] login fetch exception:", e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { country, pin } = await req.json();
  console.log(`[shiprocket] rate request — country=${country} pin=${pin}`);

  // ── Domestic India ────────────────────────────────────────────────────────
  if (country === "IN") {
    const token = await getShiprocketToken();
    if (!token) {
      console.warn("[shiprocket] no token — using fallback rates");
    } else if (!pin) {
      console.warn("[shiprocket] no PIN provided — using fallback rates");
    } else {
      try {
        const qs = new URLSearchParams({
          pickup_postcode:   PICKUP_PIN,
          delivery_postcode: pin,
          cod:    "0",
          weight: "0.5",
          length: "30",
          breadth: "25",
          height: "2",
        });
        const url = `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${qs}`;
        console.log("[shiprocket] serviceability GET:", url);
        const res = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(8000),
        });
        const data = await res.json();
        if (!res.ok) {
          console.error(`[shiprocket] serviceability failed (${res.status}):`, JSON.stringify(data));
        } else {
          console.log(`[shiprocket] serviceability status=${res.status}, message="${data?.message}", couriers=${data?.data?.available_courier_companies?.length ?? 0}`);
        }

        const couriers: Array<{ courier_name: string; rate: number; etd: number }> =
          data?.data?.available_courier_companies ?? [];

        if (couriers.length > 0) {
          const sorted = [...couriers].sort((a, b) => a.rate - b.rate);
          const std  = sorted[0];
          const fast = sorted.find((c) => Number(c.etd) <= 3) ?? null;
          console.log(`[shiprocket] cheapest=${std.courier_name} ₹${std.rate} ${std.etd}d`);
          const opts = [
            {
              id: "domestic-standard",
              label: "Standard Delivery",
              carrier: std.courier_name,
              rate: Math.max(99, Math.ceil(std.rate / 10) * 10),
              days: `${std.etd} days`,
            },
          ];
          if (fast && fast.courier_name !== std.courier_name) {
            opts.push({
              id: "domestic-express",
              label: "Express Delivery",
              carrier: fast.courier_name,
              rate: Math.max(149, Math.ceil(fast.rate / 10) * 10 + 40),
              days: `${fast.etd} days`,
            });
          }
          return NextResponse.json({ options: opts });
        }
        console.warn("[shiprocket] 0 couriers returned — using fallback rates");
      } catch (e) {
        console.error("[shiprocket] serviceability exception:", e);
      }
    }
    // Fallback fixed domestic
    return NextResponse.json({
      options: [
        { id: "domestic-standard", label: "Standard Delivery", carrier: "Delhivery / Blue Dart", rate: 99,  days: "5–7 days" },
        { id: "domestic-express",  label: "Express Delivery",  carrier: "Blue Dart Priority",    rate: 149, days: "2–3 days" },
      ],
    });
  }

  // ── International ─────────────────────────────────────────────────────────
  const r = INTL[country];
  if (r) {
    return NextResponse.json({
      options: [{ id: `intl-${country}`, label: "International Express", carrier: r.carrier, rate: r.rate, days: r.days }],
    });
  }
  // Unknown country — generic rate
  return NextResponse.json({
    options: [{ id: "intl-generic", label: "International Express", carrier: "DHL Express", rate: 2199, days: "10–15 business days" }],
  });
}
