import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET /api/organizations?userId=...
// Returns all organizations the user belongs to (as owner or member)
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = createAdminClient();

  // Get orgs where user is owner
  const { data: ownedOrgs } = await db
    .from("organizations")
    .select("id, slug, name, logo_url, description, owner_id, created_at")
    .eq("owner_id", userId);

  // Get orgs where user is a member
  const { data: memberships } = await db
    .from("organization_members")
    .select("role, organizations(id, slug, name, logo_url, description, owner_id, created_at)")
    .eq("user_id", userId);

  const memberOrgs = (memberships ?? [])
    .map((m: { role: string; organizations: unknown }) => ({
      ...(m.organizations as Record<string, unknown>),
      role: m.role,
    }))
    .filter((o) => o && (o as { owner_id?: string }).owner_id !== userId);

  const ownedWithRole = (ownedOrgs ?? []).map((o) => ({ ...o, role: "owner" }));
  const all = [...ownedWithRole, ...memberOrgs];

  // Deduplicate by id
  const seen = new Set<string>();
  const unique = all.filter((o) => {
    const id = (o as { id?: string }).id as string;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  return NextResponse.json(unique);
}

// POST /api/organizations
// Body: { userId, name, slug, description?, logoUrl? }
export async function POST(req: NextRequest) {
  const { userId, name, slug, description, logoUrl } = await req.json();
  if (!userId || !name || !slug) {
    return NextResponse.json({ error: "userId, name and slug are required" }, { status: 400 });
  }

  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "");
  const db = createAdminClient();

  // Check slug uniqueness
  const { data: existing } = await db
    .from("organizations")
    .select("id")
    .eq("slug", cleanSlug)
    .maybeSingle();
  if (existing) return NextResponse.json({ error: "That slug is already taken" }, { status: 409 });

  const { data, error } = await db
    .from("organizations")
    .insert({ slug: cleanSlug, name, description: description ?? null, logo_url: logoUrl ?? null, owner_id: userId })
    .select("id, slug, name, logo_url, description, owner_id, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Auto-add owner as member
  await db.from("organization_members").insert({ org_id: data.id, user_id: userId, role: "owner", invited_by: userId });

  return NextResponse.json({ ...data, role: "owner" });
}
