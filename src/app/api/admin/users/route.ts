import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();

  // ── 1. Fetch all Supabase Auth users (paginated) ──────────────────────────
  type AuthUser = { id: string; email?: string; created_at: string };
  const authUsers: AuthUser[] = [];
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !data?.users?.length) break;
    authUsers.push(...(data.users as AuthUser[]));
    hasMore = data.users.length === 1000;
    page++;
  }

  // ── 2. Fetch user profiles ────────────────────────────────────────────────
  const { data: profiles, error: profilesError } = await db
    .from("user_profiles")
    .select("id, user_id, customer_email, name, phone, city, state, pin, country, gst_number, company_name, created_at");

  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 });
  }

  // ── 3. Fetch all orders ───────────────────────────────────────────────────
  const { data: orders, error: ordersError } = await db
    .from("orders")
    .select("id, ref, customer_email, user_id, total, status, neck_label, created_at, product_name, mockup_url, front_design_url, back_design_url, customer_name")
    .order("created_at", { ascending: false });

  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 });
  }

  const profileList = profiles ?? [];
  const orderList = orders ?? [];

  // Build lookup maps
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

  const coveredEmails = new Set<string>();
  const coveredUserIds = new Set<string>();

  type UserResult = {
    id: string; user_id: string | null; customer_email: string | null;
    name: string | null; phone: string | null; city: string | null;
    state: string | null; pin: string | null; country: string | null;
    gst_number: string | null; company_name: string | null; created_at: string;
    order_count: number; total_spend: number; neck_label_orders: number;
    last_order_at: string | null; order_statuses: string[]; orders: OrderRow[];
    source: "profile" | "order" | "auth";
  };

  // ── 4. Build results from profiles ───────────────────────────────────────
  const results: UserResult[] = profileList.map((p) => {
    const email = (p.customer_email ?? "").toLowerCase();
    coveredEmails.add(email);
    if (p.user_id) coveredUserIds.add(p.user_id);

    const byEmail = email ? (ordersByEmail.get(email) ?? []) : [];
    const byUserId = p.user_id ? (ordersByUserId.get(p.user_id) ?? []) : [];

    const seen = new Set<string>();
    const userOrders: OrderRow[] = [];
    for (const o of [...byEmail, ...byUserId]) {
      if (!seen.has(o.id)) { seen.add(o.id); userOrders.push(o); }
    }

    const order_count = userOrders.length;
    const total_spend = userOrders.reduce((s, o) => s + (o.total ?? 0), 0);
    const neck_label_orders = userOrders.filter((o) => o.neck_label).length;
    const sorted = [...userOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const last_order_at = sorted[0]?.created_at ?? null;
    const order_statuses = [...new Set(userOrders.map((o) => o.status).filter(Boolean))];

    return {
      id: p.id, user_id: p.user_id,
      customer_email: p.customer_email, name: p.name, phone: p.phone,
      city: p.city, state: p.state, pin: p.pin, country: p.country,
      gst_number: p.gst_number, company_name: p.company_name,
      created_at: p.created_at,
      order_count, total_spend, neck_label_orders, last_order_at, order_statuses,
      orders: sorted,
      source: "profile" as const,
    };
  });

  // ── 5. Add order-only users (no profile) ──────────────────────────────────
  const emailsWithOrders = new Set<string>();
  for (const o of orderList) {
    const email = (o.customer_email ?? "").toLowerCase();
    if (email) emailsWithOrders.add(email);
  }

  for (const email of emailsWithOrders) {
    if (coveredEmails.has(email)) continue;
    const userOrders = ordersByEmail.get(email) ?? [];
    if (!userOrders.length) continue;

    const sorted = [...userOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const order_count = sorted.length;
    const total_spend = sorted.reduce((s, o) => s + (o.total ?? 0), 0);
    const neck_label_orders = sorted.filter((o) => o.neck_label).length;
    const order_statuses = [...new Set(sorted.map((o) => o.status).filter(Boolean))];
    const firstOrder = sorted[sorted.length - 1];

    coveredEmails.add(email);
    if (firstOrder.user_id) coveredUserIds.add(firstOrder.user_id);

    results.push({
      id: `synth-${email}`,
      user_id: firstOrder.user_id ?? null,
      customer_email: email,
      name: firstOrder.customer_name ?? null,
      phone: null, city: null, state: null, pin: null, country: null,
      gst_number: null, company_name: null,
      created_at: firstOrder.created_at,
      order_count, total_spend, neck_label_orders,
      last_order_at: sorted[0]?.created_at ?? null,
      order_statuses,
      orders: sorted,
      source: "order" as const,
    });
  }

  // ── 6. Add pure auth users (OAuth signups not yet in profile/orders) ───────
  const authUserById = new Map(authUsers.map((u) => [u.id, u]));
  for (const authUser of authUsers) {
    if (coveredUserIds.has(authUser.id)) continue;
    const email = (authUser.email ?? "").toLowerCase();
    if (email && coveredEmails.has(email)) continue;

    results.push({
      id: `auth-${authUser.id}`,
      user_id: authUser.id,
      customer_email: authUser.email ?? null,
      name: null, phone: null, city: null, state: null, pin: null, country: null,
      gst_number: null, company_name: null,
      created_at: authUser.created_at,
      order_count: 0, total_spend: 0, neck_label_orders: 0,
      last_order_at: null, order_statuses: [], orders: [],
      source: "auth" as const,
    });
  }

  // Enrich with provider info from auth users
  const enriched = results.map((r) => {
    if (!r.user_id) return r;
    const authUser = authUserById.get(r.user_id);
    const provider = (authUser as { app_metadata?: { provider?: string } } | undefined)?.app_metadata?.provider ?? null;
    return { ...r, provider };
  });

  // Sort by total_spend DESC, then created_at DESC
  enriched.sort((a, b) => {
    if (b.total_spend !== a.total_spend) return b.total_spend - a.total_spend;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return NextResponse.json(enriched);
}
