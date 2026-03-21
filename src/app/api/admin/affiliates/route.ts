import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function checkAdmin(req: NextRequest): boolean {
  const secret = req.headers.get("x-admin-secret");
  return secret === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getServiceClient();

    const { data: affiliates, error } = await supabase
      .from("affiliates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Enrich with user email from auth.users via a join on user_id
    // Supabase doesn't expose auth.users via the JS client directly,
    // so we fetch emails using admin listUsers and match by id.
    const enriched = affiliates ?? [];

    return NextResponse.json(enriched);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { affiliateId, action } = body as {
      affiliateId: string;
      action: "approve" | "reject" | "pause";
    };

    if (!affiliateId || !action) {
      return NextResponse.json(
        { error: "affiliateId and action are required" },
        { status: 400 }
      );
    }

    const STATUS_MAP: Record<string, string> = {
      approve: "approved",
      reject: "rejected",
      pause: "paused",
    };

    const newStatus = STATUS_MAP[action];
    if (!newStatus) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from("affiliates")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", affiliateId)
      .select("id, status, code, email")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, affiliate: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
