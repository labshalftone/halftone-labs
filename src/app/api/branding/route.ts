import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, customerEmail, darkLabelBase64, lightLabelBase64 } = body;
    if (!userId && !customerEmail) return NextResponse.json({ error: "userId or email required" }, { status: 400 });

    const db = createAdminClient();
    // Upsert — one branding record per user
    const { data, error } = await db.from("branding").upsert({
      user_id: userId ?? null,
      customer_email: customerEmail?.toLowerCase().trim() ?? null,
      dark_label: darkLabelBase64 ?? null,
      light_label: lightLabelBase64 ?? null,
      updated_at: new Date().toISOString(),
    }, { onConflict: userId ? "user_id" : "customer_email" }).select("id").single();

    if (error) throw error;
    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error("branding save error:", err);
    return NextResponse.json({ error: "Failed to save branding" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const email  = searchParams.get("email")?.toLowerCase().trim();
  if (!userId && !email) return NextResponse.json({ error: "userId or email required" }, { status: 400 });

  const db = createAdminClient();
  let query = db.from("branding").select("*");
  if (userId) query = query.eq("user_id", userId);
  else if (email) query = query.eq("customer_email", email);

  const { data, error } = await query.maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? null);
}
