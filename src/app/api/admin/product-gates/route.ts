import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PLAN_ORDER, type PlanKey } from "@/lib/plans";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "";

function auth(req: NextRequest): boolean {
  return req.headers.get("x-admin-secret") === ADMIN_SECRET && !!ADMIN_SECRET;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

// GET — list all product gate overrides
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("product_plan_gates")
    .select("product_id, required_plan");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST — upsert a product gate override
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { product_id: string; required_plan: string | null };
  const { product_id, required_plan } = body;

  if (!product_id) return NextResponse.json({ error: "product_id is required" }, { status: 400 });

  const plan = required_plan && (PLAN_ORDER as string[]).includes(required_plan)
    ? (required_plan as PlanKey)
    : null;

  const supabase = getSupabase();

  if (plan === null) {
    // Remove the override — fall back to code default
    const { error } = await supabase
      .from("product_plan_gates")
      .delete()
      .eq("product_id", product_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase
      .from("product_plan_gates")
      .upsert({ product_id, required_plan: plan, updated_at: new Date().toISOString() }, { onConflict: "product_id" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
