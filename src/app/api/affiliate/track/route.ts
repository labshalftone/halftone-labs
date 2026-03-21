import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, page, ip } = body as {
      code: string;
      page?: string;
      ip?: string;
    };

    if (!code) {
      return NextResponse.json({ error: "code is required" }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Find approved affiliate by code
    const { data: affiliate, error: findError } = await supabase
      .from("affiliates")
      .select("id, total_clicks")
      .eq("code", code)
      .eq("status", "approved")
      .maybeSingle();

    if (findError) {
      return NextResponse.json({ error: findError.message }, { status: 500 });
    }

    if (!affiliate) {
      return NextResponse.json(
        { error: "Invalid or inactive code" },
        { status: 404 }
      );
    }

    // Increment total_clicks
    await supabase
      .from("affiliates")
      .update({ total_clicks: (affiliate.total_clicks ?? 0) + 1 })
      .eq("id", affiliate.id);

    // Insert click record
    await supabase.from("affiliate_clicks").insert({
      affiliate_id: affiliate.id,
      code,
      page: page ?? null,
      ip: ip ?? null,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
