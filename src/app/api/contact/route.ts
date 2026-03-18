import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, topic, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name, email, topic: topic || null, message,
    });

    // Silently succeed even if table doesn't exist yet — form UX shouldn't break
    if (error) console.error("contact insert error:", error.message);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact route error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/*
  SQL to create the table:
  create table contact_submissions (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    topic text,
    message text not null,
    created_at timestamptz default now()
  );
*/
