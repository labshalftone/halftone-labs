"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import {
  PLANS,
  getEntitlements,
  canAccess,
  getLimit,
  type PlanKey,
  type PlanEntitlements,
} from "@/lib/plans";

export interface SubscriptionState {
  plan:                    PlanKey;
  status:                  "active" | "cancelled" | "expired" | "none";
  billing:                 "monthly" | "annual" | null;
  razorpaySubscriptionId:  string | null;
  loading:                 boolean;
  entitlements:            PlanEntitlements;
  /** Can the current plan access this feature? */
  can:   (feature: keyof PlanEntitlements) => boolean;
  /** Numeric limit for a feature (0 = none, Infinity = unlimited). */
  limit: (feature: keyof PlanEntitlements) => number;
  /** Refresh from DB (call after plan change). */
  refresh: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionState>({
  plan:                   "free",
  status:                 "none",
  billing:                null,
  razorpaySubscriptionId: null,
  loading:                true,
  entitlements:           getEntitlements("free"),
  can:     () => false,
  limit:   () => 0,
  refresh: async () => {},
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plan,    setPlan]    = useState<PlanKey>("free");
  const [status,  setStatus]  = useState<SubscriptionState["status"]>("none");
  const [billing, setBilling] = useState<"monthly" | "annual" | null>(null);
  const [rzpId,   setRzpId]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setPlan("free");
      setStatus("none");
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("subscriptions")
      .select("plan, status, billing, razorpay_subscription_id")
      .eq("user_id", session.user.id)
      .in("status", ["active", "cancelled"]) // include cancelled (still active until period end)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data && data.status === "active") {
      setPlan((data.plan as PlanKey) || "free");
      setStatus("active");
      setBilling(data.billing as "monthly" | "annual" | null);
      setRzpId(data.razorpay_subscription_id);
    } else if (data && data.status === "cancelled") {
      // Cancelled but still in grace period — keep plan active
      setPlan((data.plan as PlanKey) || "free");
      setStatus("cancelled");
      setBilling(data.billing as "monthly" | "annual" | null);
      setRzpId(data.razorpay_subscription_id);
    } else {
      setPlan("free");
      setStatus("none");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(() => {
      setLoading(true);
      load();
    });
    return () => authSub.unsubscribe();
  }, [load]);

  const entitlements = getEntitlements(plan);
  const can   = (feature: keyof PlanEntitlements) => canAccess(plan, feature);
  const limit = (feature: keyof PlanEntitlements) => getLimit(plan, feature);

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        status,
        billing,
        razorpaySubscriptionId: rzpId,
        loading,
        entitlements,
        can,
        limit,
        refresh: load,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => useContext(SubscriptionContext);
