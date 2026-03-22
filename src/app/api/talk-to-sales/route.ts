import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, brand, volume, needs, notes } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("sales_leads").insert({
      name,
      email,
      brand: brand || null,
      volume: volume || null,
      needs: needs || null,       // stored as text (comma-separated checkboxes)
      notes: notes || null,
    });

    if (error) console.error("sales_leads insert error:", error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("talk-to-sales route error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/*
  SQL to create the table:
  create table sales_leads (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    brand text,
    volume text,
    needs text,
    notes text,
    created_at timestamptz default now()
  );
*/
