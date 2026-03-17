import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email  = searchParams.get("email")?.toLowerCase().trim();
  const userId = searchParams.get("userId");

  if (!email && !userId) {
    return NextResponse.json({ error: "Email or userId required" }, { status: 400 });
  }

  const db = createAdminClient();
  let query = db
    .from("orders")
    .select("*, milestones(id, title, description, created_at)")
    .order("created_at", { ascending: false })
    .order("created_at", { referencedTable: "milestones", ascending: true });

  if (userId) query = query.eq("user_id", userId);
  else if (email) query = query.eq("customer_email", email);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
