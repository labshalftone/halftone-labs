import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// POST /api/drops/products — add a design to a drop
// Body: { dropId, designId, userId }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dropId, designId, userId } = body;
    if (!dropId || !designId || !userId) {
      return NextResponse.json({ error: "dropId, designId, and userId required" }, { status: 400 });
    }

    const db = createAdminClient();

    // Verify the drop belongs to this user
    const { data: drop, error: dropErr } = await db
      .from("drops")
      .select("id")
      .eq("id", dropId)
      .eq("user_id", userId)
      .maybeSingle();

    if (dropErr) return NextResponse.json({ error: dropErr.message }, { status: 500 });
    if (!drop) return NextResponse.json({ error: "Drop not found or access denied" }, { status: 404 });

    const { error } = await db
      .from("drop_products")
      .insert({ drop_id: dropId, design_id: designId });

    if (error) {
      // Unique constraint violation — already added
      if (error.code === "23505") {
        return NextResponse.json({ success: true, message: "Design already in drop" });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[drops/products/POST]", err);
    return NextResponse.json({ error: "Failed to add design to drop" }, { status: 500 });
  }
}

// DELETE /api/drops/products?dropId=...&designId=...&userId=...
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dropId = searchParams.get("dropId");
  const designId = searchParams.get("designId");
  const userId = searchParams.get("userId");

  if (!dropId || !designId || !userId) {
    return NextResponse.json({ error: "dropId, designId, and userId required" }, { status: 400 });
  }

  const db = createAdminClient();

  // Verify the drop belongs to this user
  const { data: drop, error: dropErr } = await db
    .from("drops")
    .select("id")
    .eq("id", dropId)
    .eq("user_id", userId)
    .maybeSingle();

  if (dropErr) return NextResponse.json({ error: dropErr.message }, { status: 500 });
  if (!drop) return NextResponse.json({ error: "Drop not found or access denied" }, { status: 404 });

  const { error } = await db
    .from("drop_products")
    .delete()
    .eq("drop_id", dropId)
    .eq("design_id", designId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
