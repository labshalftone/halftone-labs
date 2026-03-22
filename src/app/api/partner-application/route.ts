import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, brand, partner_type, website, volume, notes } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("partner_applications").insert({
      name,
      email,
      brand: brand || null,
      partner_type: partner_type || null,
      website: website || null,
      volume: volume || null,
      notes: notes || null,
    });

    if (error) console.error("partner_applications insert error:", error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("partner-application route error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/*
  SQL to create the table:
  create table partner_applications (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    brand text,
    partner_type text,
    website text,
    volume text,
    notes text,
    created_at timestamptz default now()
  );
*/
