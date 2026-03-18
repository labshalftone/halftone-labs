import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET /api/drops/waitlist?dropId=...&userId=... (owner only)
export async function GET(req: NextRequest) {
  const dropId = req.nextUrl.searchParams.get("dropId");
  const userId = req.nextUrl.searchParams.get("userId");
  if (!dropId) return NextResponse.json({ error: "dropId required" }, { status: 400 });

  const db = createAdminClient();

  // Verify ownership
  if (userId) {
    const { data: drop } = await db.from("drops").select("user_id").eq("id", dropId).maybeSingle();
    if (drop && drop.user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await db
    .from("drop_waitlist_signups")
    .select("id, email, phone, whatsapp_consent, created_at")
    .eq("drop_id", dropId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ signups: data ?? [], count: (data ?? []).length });
}

// POST /api/drops/waitlist — public signup (no auth required)
export async function POST(req: NextRequest) {
  const { dropId, email, phone, whatsappConsent } = await req.json();
  if (!dropId || !email) return NextResponse.json({ error: "dropId and email required" }, { status: 400 });

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const db = createAdminClient();

  // Verify drop is in a state that accepts waitlist signups
  const { data: drop } = await db.from("drops").select("status, waitlist_enabled").eq("id", dropId).maybeSingle();
  if (!drop) return NextResponse.json({ error: "Drop not found" }, { status: 404 });
  if (!drop.waitlist_enabled) return NextResponse.json({ error: "Waitlist not enabled for this drop" }, { status: 400 });

  const { error } = await db.from("drop_waitlist_signups").upsert(
    { drop_id: dropId, email: email.toLowerCase().trim(), phone: phone ?? null, whatsapp_consent: whatsappConsent ?? false },
    { onConflict: "drop_id,email", ignoreDuplicates: true }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, message: "You're on the list! We'll notify you when this drop goes live." });
}
