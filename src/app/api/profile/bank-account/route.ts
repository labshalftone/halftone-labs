import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET /api/profile/bank-account?userId=...
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = createAdminClient();
  const { data } = await db
    .from("bank_accounts")
    .select("id, account_holder_name, account_number_masked, ifsc_code, bank_name, account_type, verified, created_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return NextResponse.json(null);
  return NextResponse.json(data);
}

// POST /api/profile/bank-account
// Body: { userId, accountHolderName, accountNumber, ifscCode, bankName, accountType }
export async function POST(req: NextRequest) {
  const { userId, accountHolderName, accountNumber, ifscCode, bankName, accountType } = await req.json();
  if (!userId || !accountHolderName || !accountNumber || !ifscCode || !bankName) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  const db = createAdminClient();

  // Mask account number (show only last 4 digits)
  const masked = "•".repeat(Math.max(0, accountNumber.length - 4)) + accountNumber.slice(-4);

  const { error } = await db.from("bank_accounts").upsert(
    {
      user_id: userId,
      account_holder_name: accountHolderName,
      account_number_masked: masked,
      account_number_encrypted: accountNumber, // In production, encrypt this
      ifsc_code: ifscCode.toUpperCase(),
      bank_name: bankName,
      account_type: accountType ?? "savings",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
