// SQL to run before using this module:
// ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS gst_number text;
// ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS company_name text;
// CREATE TABLE IF NOT EXISTS invoices (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id uuid,
//   customer_email text,
//   invoice_number text NOT NULL UNIQUE,
//   type text NOT NULL DEFAULT 'order',
//   order_id uuid,
//   month text,
//   subtotal numeric NOT NULL DEFAULT 0,
//   gst_amount numeric NOT NULL DEFAULT 0,
//   total numeric NOT NULL DEFAULT 0,
//   status text NOT NULL DEFAULT 'issued',
//   gst_number text,
//   company_name text,
//   customer_name text,
//   customer_address text,
//   items jsonb,
//   issued_at timestamptz DEFAULT now(),
//   created_at timestamptz DEFAULT now()
// );

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const email = searchParams.get("email")?.toLowerCase().trim();

  if (!userId && !email) {
    return NextResponse.json({ error: "userId or email required" }, { status: 400 });
  }

  const db = createAdminClient();
  let query = db.from("invoices").select("*").order("created_at", { ascending: false });

  if (userId) query = query.eq("user_id", userId);
  else if (email) query = query.eq("customer_email", email);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      invoice_number,
      type,
      order_id,
      month,
      user_id,
      customer_email,
      subtotal,
      gst_amount,
      total,
      status,
      gst_number,
      company_name,
      customer_name,
      customer_address,
      items,
    } = body;

    if (!invoice_number) {
      return NextResponse.json({ error: "invoice_number is required" }, { status: 400 });
    }

    const db = createAdminClient();
    const { data, error } = await db
      .from("invoices")
      .insert({
        invoice_number,
        type: type ?? "order",
        order_id: order_id ?? null,
        month: month ?? null,
        user_id: user_id ?? null,
        customer_email: customer_email?.toLowerCase().trim() ?? null,
        subtotal: subtotal ?? 0,
        gst_amount: gst_amount ?? 0,
        total: total ?? 0,
        status: status ?? "issued",
        gst_number: gst_number ?? null,
        company_name: company_name ?? null,
        customer_name: customer_name ?? null,
        customer_address: customer_address ?? null,
        items: items ?? null,
        issued_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[invoices POST] error:", err);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
