import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET /api/drops/[id]?userId=...
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = req.nextUrl.searchParams.get("userId");

  const db = createAdminClient();
  const query = db.from("drops").select("*, drop_products(*, designs(id, name, product_name, color_name, thumbnail, front_design_url, back_design_url))").eq("id", id);

  const { data, error } = await query.maybeSingle();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Auth check if userId provided
  if (userId && data.user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(data);
}
