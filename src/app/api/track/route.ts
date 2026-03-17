import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref")?.toUpperCase().trim();
  const email = searchParams.get("email")?.toLowerCase().trim();

  if (!ref || !email) {
    return NextResponse.json({ error: "Order reference and email are required" }, { status: 400 });
  }

  const db = createAdminClient();

  const { data: order, error } = await db
    .from("orders")
    .select("*, milestones(id, title, description, created_at)")
    .eq("ref", ref)
    .eq("customer_email", email)
    .order("created_at", { referencedTable: "milestones", ascending: true })
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found. Check your order reference and email." }, { status: 404 });
  }

  return NextResponse.json(order);
}
