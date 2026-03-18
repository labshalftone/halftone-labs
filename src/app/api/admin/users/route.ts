import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();

  // Fetch all user profiles
  const { data: profiles, error: profilesError } = await db
    .from("user_profiles")
    .select("id, user_id, customer_email, name, phone, city, state, pin, country, gst_number, company_name, created_at");

  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 });
  }

  // Fetch all orders (lightweight fields)
  const { data: orders, error: ordersError } = await db
    .from("orders")
    .select("id, ref, customer_email, user_id, total, status, neck_label, created_at, product_name, mockup_url, front_design_url, back_design_url, customer_name")
    .order("created_at", { ascending: false });

  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 });
  }

  const profileList = profiles ?? [];
  const orderList = orders ?? [];

  // Build a map keyed by email for fast lookup
  type OrderRow = typeof orderList[number];
  const ordersByEmail = new Map<string, OrderRow[]>();
  const ordersByUserId = new Map<string, OrderRow[]>();

  for (const o of orderList) {
    const email = (o.customer_email ?? "").toLowerCase();
    if (email) {
      if (!ordersByEmail.has(email)) ordersByEmail.set(email, []);
      ordersByEmail.get(email)!.push(o);
    }
    if (o.user_id) {
      if (!ordersByUserId.has(o.user_id)) ordersByUserId.set(o.user_id, []);
      ordersByUserId.get(o.user_id)!.push(o);
    }
  }

  // Track which emails are covered by a profile
  const coveredEmails = new Set<string>();

  const results = profileList.map((p) => {
    const email = (p.customer_email ?? "").toLowerCase();
    coveredEmails.add(email);

    // Merge orders by email OR user_id
    const byEmail = email ? (ordersByEmail.get(email) ?? []) : [];
    const byUserId = p.user_id ? (ordersByUserId.get(p.user_id) ?? []) : [];

    // Deduplicate by order id
    const seen = new Set<string>();
    const userOrders: OrderRow[] = [];
    for (const o of [...byEmail, ...byUserId]) {
      if (!seen.has(o.id)) {
        seen.add(o.id);
        userOrders.push(o);
      }
    }

    const order_count = userOrders.length;
    const total_spend = userOrders.reduce((s, o) => s + (o.total ?? 0), 0);
    const neck_label_orders = userOrders.filter((o) => o.neck_label).length;
    const last_order_at = userOrders.length > 0
      ? userOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
      : null;
    const order_statuses = [...new Set(userOrders.map((o) => o.status).filter(Boolean))];

    return {
      id: p.id,
      user_id: p.user_id,
      customer_email: p.customer_email,
      name: p.name,
      phone: p.phone,
      city: p.city,
      state: p.state,
      pin: p.pin,
      country: p.country,
      gst_number: p.gst_number,
      company_name: p.company_name,
      created_at: p.created_at,
      order_count,
      total_spend,
      neck_label_orders,
      last_order_at,
      order_statuses,
      orders: userOrders,
    };
  });

  // Add users who have orders but NO profile
  const emailsWithOrders = new Set<string>();
  for (const o of orderList) {
    const email = (o.customer_email ?? "").toLowerCase();
    if (email) emailsWithOrders.add(email);
  }

  for (const email of emailsWithOrders) {
    if (coveredEmails.has(email)) continue;

    const userOrders = ordersByEmail.get(email) ?? [];
    if (userOrders.length === 0) continue;

    const firstOrder = userOrders[userOrders.length - 1]; // oldest
    const order_count = userOrders.length;
    const total_spend = userOrders.reduce((s, o) => s + (o.total ?? 0), 0);
    const neck_label_orders = userOrders.filter((o) => o.neck_label).length;
    const sorted = [...userOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const last_order_at = sorted[0]?.created_at ?? null;
    const order_statuses = [...new Set(userOrders.map((o) => o.status).filter(Boolean))];

    results.push({
      id: `synth-${email}`,
      user_id: firstOrder.user_id ?? null,
      customer_email: email,
      name: firstOrder.customer_name ?? null,
      phone: null,
      city: null,
      state: null,
      pin: null,
      country: null,
      gst_number: null,
      company_name: null,
      created_at: firstOrder.created_at,
      order_count,
      total_spend,
      neck_label_orders,
      last_order_at,
      order_statuses,
      orders: sorted,
    });
  }

  // Sort by total_spend DESC
  results.sort((a, b) => b.total_spend - a.total_spend);

  return NextResponse.json(results);
}
