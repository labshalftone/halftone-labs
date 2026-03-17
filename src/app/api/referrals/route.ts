import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// Generate referral code from user metadata
async function generateCode(userId: string): Promise<string> {
  const supabase = createAdminClient();
  const { data: user } = await supabase.auth.admin.getUserById(userId);
  const name = (user?.user?.user_metadata?.name ?? user?.user?.email ?? "HL")
    .split(/[\s@]/)[0]
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `HL-${name}${suffix}`;
}

export async function GET(req: NextRequest) {
  const supabase = createAdminClient();
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  // Check if code already exists
  const { data: existing } = await supabase
    .from("referrals")
    .select("referral_code, credit_amount_inr, credited")
    .eq("referrer_user_id", userId)
    .is("referred_user_id", null)
    .single();

  if (existing) return NextResponse.json({ code: existing.referral_code });

  // Create one
  const code = await generateCode(userId);
  const { data, error } = await supabase
    .from("referrals")
    .insert({ referrer_user_id: userId, referral_code: code })
    .select("referral_code")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ code: data.referral_code });
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();
  const { code, referred_user_id, order_id, order_total } = await req.json();

  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });

  // Find the referral record for this code (the unlinked one)
  const { data: referral } = await supabase
    .from("referrals")
    .select("id, referrer_user_id")
    .eq("referral_code", code)
    .is("referred_user_id", null)
    .single();

  if (!referral) return NextResponse.json({ error: "Invalid or already used code" }, { status: 404 });

  const credit = order_total ? Math.round(order_total * 0.05) : 0;

  const { error } = await supabase
    .from("referrals")
    .update({
      referred_user_id,
      order_id,
      credit_amount_inr: credit,
      credited: false,
    })
    .eq("id", referral.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, credit_amount_inr: credit });
}
