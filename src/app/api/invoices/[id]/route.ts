import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Invoice id or number required" }, { status: 400 });
  }

  const db = createAdminClient();

  // Try by UUID first, then by invoice_number
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  let data: Record<string, unknown> | null = null;
  let error: { message: string } | null = null;

  if (isUuid) {
    const result = await db.from("invoices").select("*").eq("id", id).maybeSingle();
    data = result.data;
    error = result.error;
  } else {
    const result = await db
      .from("invoices")
      .select("*")
      .eq("invoice_number", id)
      .maybeSingle();
    data = result.data;
    error = result.error;
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  return NextResponse.json(data);
}
