import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();

  const [contactRes, salesRes, partnerRes] = await Promise.all([
    db.from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false }),
    db.from("sales_leads")
      .select("*")
      .order("created_at", { ascending: false }),
    db.from("partner_applications")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  return NextResponse.json({
    contact: contactRes.data ?? [],
    sales: salesRes.data ?? [],
    partners: partnerRes.data ?? [],
  });
}
