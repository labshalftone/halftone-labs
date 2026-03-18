import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET /api/organizations/[slug]/stores?userId=...
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = createAdminClient();
  const { data: org } = await db.from("organizations").select("id, owner_id").eq("slug", slug).maybeSingle();
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: stores } = await db
    .from("artist_stores")
    .select("id, handle, artist_name, description, user_id, created_at")
    .eq("organization_id", org.id);

  return NextResponse.json(stores ?? []);
}

// POST /api/organizations/[slug]/stores
// Body: { userId, storeHandle } — links an existing store to this org
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { userId, storeHandle } = await req.json();
  if (!userId || !storeHandle) return NextResponse.json({ error: "userId and storeHandle required" }, { status: 400 });

  const db = createAdminClient();
  const { data: org } = await db.from("organizations").select("id, owner_id").eq("slug", slug).maybeSingle();
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (org.owner_id !== userId) return NextResponse.json({ error: "Only owner can add stores" }, { status: 403 });

  const { error } = await db
    .from("artist_stores")
    .update({ organization_id: org.id })
    .eq("handle", storeHandle);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
