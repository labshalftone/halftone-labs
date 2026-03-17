import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { code, orderTotal } = await req.json();
    if (!code) return NextResponse.json({ error: "Coupon code required" }, { status: 400 });

    const db = createAdminClient();
    const { data: coupon, error } = await db
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .eq("active", true)
      .maybeSingle();

    if (error) throw error;
    if (!coupon) return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    // Check max uses
    if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    // Check min order
    if (coupon.min_order && orderTotal < coupon.min_order) {
      return NextResponse.json({
        error: `Minimum order of ₹${coupon.min_order} required for this coupon`,
      }, { status: 400 });
    }

    // Calculate discount
    const discountAmount =
      coupon.discount_type === "percent"
        ? Math.round(orderTotal * coupon.discount_value / 100)
        : coupon.discount_value;

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount_amount: Math.min(discountAmount, orderTotal), // can't discount more than order
      description: coupon.description ?? null,
    });
  } catch (err) {
    console.error("coupon error:", err);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}

// Increment uses count (called after successful payment)
export async function PATCH(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });
    const db = createAdminClient();
    await db.rpc("increment_coupon_uses", { p_code: code });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("coupon increment error:", err);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}
