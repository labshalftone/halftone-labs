import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET /api/organizations/[slug]?userId=...
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const userId = req.nextUrl.searchParams.get("userId");

  const db = createAdminClient();
  const { data: org, error } = await db
    .from("organizations")
    .select("id, slug, name, logo_url, description, owner_id, created_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !org) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Check access
  if (userId) {
    const { data: membership } = await db
      .from("organization_members")
      .select("role")
      .eq("org_id", org.id)
      .eq("user_id", userId)
      .maybeSingle();
    if (!membership && org.owner_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ ...org, role: membership?.role ?? "owner" });
  }

  return NextResponse.json(org);
}

// PATCH /api/organizations/[slug]
// Body: { userId, name?, description?, logoUrl? }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { userId, name, description, logoUrl } = await req.json();

  const db = createAdminClient();
  const { data: org } = await db.from("organizations").select("id, owner_id").eq("slug", slug).maybeSingle();
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (org.owner_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (logoUrl !== undefined) updates.logo_url = logoUrl;

  const { data, error } = await db
    .from("organizations")
    .update(updates)
    .eq("id", org.id)
    .select("id, slug, name, logo_url, description, owner_id, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
