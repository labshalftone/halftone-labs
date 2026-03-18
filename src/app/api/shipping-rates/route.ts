import { NextRequest, NextResponse } from "next/server";

const PICKUP_PIN = "144004";

// DHL Express international rate card from India (INR, ~45% margin over cost)
// base = rate for first 0.5 kg | perKg = rate per additional kg above 0.5 kg
const INTL_RATES: Record<string, {
  carrier: string; days: string;
  base: number;   // price for first 0.5 kg
  perKg: number;  // price per additional kg (or part thereof)
}> = {
  US: { carrier: "DHL Express", days: "7–10 business days", base: 1999, perKg: 650 },
  CA: { carrier: "DHL Express", days: "7–12 business days", base: 2399, perKg: 720 },
  GB: { carrier: "DHL Express", days: "5–8 business days",  base: 1799, perKg: 600 },
  DE: { carrier: "DHL Express", days: "6–9 business days",  base: 1899, perKg: 610 },
  FR: { carrier: "DHL Express", days: "6–9 business days",  base: 1899, perKg: 610 },
  NL: { carrier: "DHL Express", days: "6–9 business days",  base: 1899, perKg: 610 },
  IT: { carrier: "DHL Express", days: "6–9 business days",  base: 1899, perKg: 610 },
  ES: { carrier: "DHL Express", days: "6–9 business days",  base: 1899, perKg: 610 },
  AU: { carrier: "DHL Express", days: "8–12 business days", base: 2299, perKg: 700 },
  SG: { carrier: "DHL Express", days: "3–5 business days",  base: 1099, perKg: 400 },
  TH: { carrier: "DHL Express", days: "4–7 business days",  base: 1149, perKg: 420 },
  AE: { carrier: "DHL Express", days: "4–6 business days",  base: 1299, perKg: 450 },
  JP: { carrier: "DHL Express", days: "5–8 business days",  base: 1649, perKg: 540 },
  NZ: { carrier: "DHL Express", days: "9–14 business days", base: 2399, perKg: 720 },
};

// Compute weight-based international rate
// weight = actual shipment weight in kg (already in 0.5kg slabs from checkout)
function intlRate(country: string, weight: number): { rate: number; carrier: string; days: string } | null {
  const r = INTL_RATES[country];
  if (!r) return null;
  // Additional weight above the base 0.5 kg, billed per 0.5 kg slab
  const extraSlabs = Math.max(0, Math.ceil((weight - 0.5) / 0.5));
  const raw = r.base + extraSlabs * (r.perKg / 2); // perKg / 2 = per 0.5 kg
  return { rate: Math.ceil(raw / 10) * 10, carrier: r.carrier, days: r.days };
}

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

// Parse ETD from Shiprocket (may be a date string like "Mar 24, 2026" or a number of days)
const etdToDays = (etd: string | number): number => {
  if (typeof etd === "number" && !isNaN(etd)) return Math.max(1, etd);
  const d = new Date(etd);
  if (!isNaN(d.getTime())) return Math.max(1, Math.ceil((d.getTime() - Date.now()) / 86_400_000));
  const n = parseFloat(String(etd));
  return isNaN(n) ? 7 : Math.max(1, n);
};

const etdLabel = (etd: string | number): string => {
  const d = etdToDays(etd);
  return `${d}–${d + 1} days`;
};

export async function POST(req: NextRequest) {
  const { country, pin, weight: rawWeight } = await req.json();
  // Weight in kg, min 0.5kg slab
  const weight = typeof rawWeight === "number" && rawWeight > 0
    ? rawWeight
    : 0.5;
  console.log(`[shiprocket] rate request — country=${country} pin=${pin} weight=${weight}kg`);

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
          cod:     "0",
          weight:  String(weight),
          length:  "30",
          breadth: "25",
          height:  "2",
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
          console.log(`[shiprocket] serviceability status=${res.status}, couriers=${data?.data?.available_courier_companies?.length ?? 0}`);
        }

        const couriers: Array<{
          courier_name: string; rate: number; etd: string | number;
          mode?: string; [k: string]: unknown;
        }> = data?.data?.available_courier_companies ?? [];

        if (couriers.length > 0) {
          console.log("[shiprocket] sample courier fields:", JSON.stringify(couriers[0]));
          console.log(`[shiprocket] all couriers: ${couriers.map(c => `${c.courier_name}|mode=${c.mode}|₹${c.rate}`).join(" / ")}`);

          // Filter to Delhivery only
          const delhivery = couriers.filter(c =>
            c.courier_name.toLowerCase().includes("delhivery")
          );
          console.log(`[shiprocket] delhivery couriers: ${delhivery.map(c => `${c.courier_name}|mode=${c.mode}|₹${c.rate}`).join(" / ")}`);

          // If no Delhivery found, fall through to fallback
          if (delhivery.length > 0) {
            // Detect mode from mode field or name
            const getMode = (c: typeof couriers[0]): "air" | "surface" | "other" => {
              const m = String(c.mode ?? "").toLowerCase();
              const n = c.courier_name.toLowerCase();
              if (m.includes("air")     || n.includes("air"))     return "air";
              if (m.includes("surface") || n.includes("surface")) return "surface";
              return "other";
            };

            const airCouriers     = delhivery.filter(c => getMode(c) === "air");
            const surfaceCouriers = delhivery.filter(c => getMode(c) === "surface");
            const otherCouriers   = delhivery.filter(c => getMode(c) === "other");

            const cheapest = (list: typeof couriers) =>
              [...list].sort((a, b) => a.rate - b.rate)[0] ?? null;

            // Pick cheapest surface and air; "other" as fallback for whichever is missing
            const surface = cheapest(surfaceCouriers) ?? cheapest(otherCouriers);
            const air     = cheapest(airCouriers)     ?? cheapest(otherCouriers);

            console.log(`[shiprocket] delhivery → surface=${surface?.courier_name ?? "none"} ₹${surface?.rate} | air=${air?.courier_name ?? "none"} ₹${air?.rate}`);

            const opts = [];

            if (surface) {
              const surfaceRate = Math.max(99, Math.ceil(surface.rate / 10) * 10);
              opts.push({
                id:      "domestic-surface",
                label:   "Surface Delivery",
                carrier: "Standard",
                rate:    surfaceRate,
                days:    etdLabel(surface.etd),
              });

              if (air && air.courier_name !== surface.courier_name) {
                // Air must be >= surface rate (it's faster, not cheaper)
                const airRateRaw  = Math.ceil(air.rate / 10) * 10;
                const airRate     = Math.max(surfaceRate + 30, airRateRaw);
                opts.push({
                  id:      "domestic-air",
                  label:   "Air Delivery",
                  carrier: "Express",
                  rate:    airRate,
                  days:    etdLabel(air.etd),
                });
              }
            } else if (air) {
              // Only air available
              opts.push({
                id:      "domestic-air",
                label:   "Air Delivery",
                carrier: "Express",
                rate:    Math.max(99, Math.ceil(air.rate / 10) * 10),
                days:    etdLabel(air.etd),
              });
            } else {
              // Other only
              const best = cheapest(otherCouriers)!;
              opts.push({
                id:      "domestic-standard",
                label:   "Standard Delivery",
                carrier: "Standard",
                rate:    Math.max(99, Math.ceil(best.rate / 10) * 10),
                days:    etdLabel(best.etd),
              });
            }

            if (opts.length > 0) return NextResponse.json({ options: opts });
          }
        }
        console.warn("[shiprocket] no Delhivery couriers returned — using fallback rates");
      } catch (e) {
        console.error("[shiprocket] serviceability exception:", e);
      }
    }
    // Fallback fixed domestic
    return NextResponse.json({
      options: [
        { id: "domestic-standard", label: "Standard Delivery", carrier: "Standard", rate: 99,  days: "5–7 days" },
        { id: "domestic-express",  label: "Express Delivery",  carrier: "Express",  rate: 149, days: "2–3 days" },
      ],
    });
  }

  // ── International ─────────────────────────────────────────────────────────
  const intl = intlRate(country, weight);
  if (intl) {
    console.log(`[intl] country=${country} weight=${weight}kg → ₹${intl.rate}`);
    return NextResponse.json({
      options: [{ id: `intl-${country}`, label: "International Express", carrier: intl.carrier, rate: intl.rate, days: intl.days }],
    });
  }
  // Unknown country — generic weight-based rate (~DHL zone 8, ~45% margin)
  const genericBase = 2699;
  const genericExtra = Math.max(0, Math.ceil((weight - 0.5) / 0.5)) * 400;
  const genericRate  = Math.ceil((genericBase + genericExtra) / 10) * 10;
  console.log(`[intl] unknown country=${country} weight=${weight}kg → ₹${genericRate}`);
  return NextResponse.json({
    options: [{ id: "intl-generic", label: "International Express", carrier: "DHL Express", rate: genericRate, days: "10–15 business days" }],
  });
}
