import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET /api/organizations/[slug]/members?userId=...
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

  const { data: members } = await db
    .from("organization_members")
    .select("id, user_id, role, created_at")
    .eq("org_id", org.id)
    .order("created_at", { ascending: true });

  // Enrich with user profile names/emails
  const userIds = (members ?? []).map((m) => m.user_id);
  const { data: profiles } = userIds.length
    ? await db.from("user_profiles").select("user_id, name, email").in("user_id", userIds)
    : { data: [] };

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.user_id, p]));
  const enriched = (members ?? []).map((m) => ({
    ...m,
    name:  profileMap[m.user_id]?.name  ?? null,
    email: profileMap[m.user_id]?.email ?? null,
  }));

  return NextResponse.json(enriched);
}

// POST /api/organizations/[slug]/members
// Body: { userId (requester), inviteEmail, role }
// For v1: looks up user by email from user_profiles and adds them directly
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { userId, inviteEmail, role } = await req.json();
  if (!userId || !inviteEmail) return NextResponse.json({ error: "userId and inviteEmail required" }, { status: 400 });

  const db = createAdminClient();
  const { data: org } = await db.from("organizations").select("id, owner_id").eq("slug", slug).maybeSingle();
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (org.owner_id !== userId) return NextResponse.json({ error: "Only owner can add members" }, { status: 403 });

  // Look up invitee by email
  const { data: invitee } = await db
    .from("user_profiles")
    .select("user_id")
    .eq("email", inviteEmail.toLowerCase().trim())
    .maybeSingle();

  if (!invitee) {
    return NextResponse.json({ error: "No Halftone Labs account found with that email" }, { status: 404 });
  }

  const { error } = await db.from("organization_members").upsert(
    { org_id: org.id, user_id: invitee.user_id, role: role ?? "contributor", invited_by: userId },
    { onConflict: "org_id,user_id" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE /api/organizations/[slug]/members?userId=...&removeUserId=...
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const userId       = req.nextUrl.searchParams.get("userId");
  const removeUserId = req.nextUrl.searchParams.get("removeUserId");
  if (!userId || !removeUserId) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  const db = createAdminClient();
  const { data: org } = await db.from("organizations").select("id, owner_id").eq("slug", slug).maybeSingle();
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (org.owner_id !== userId && userId !== removeUserId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.from("organization_members").delete().eq("org_id", org.id).eq("user_id", removeUserId);
  return NextResponse.json({ success: true });
}
