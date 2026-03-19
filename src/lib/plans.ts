// ─── Single source of truth for all plan definitions ─────────────────────────
// Everything subscription-related in the product derives from this file.
// Import PLANS or the helper functions — never hardcode plan logic elsewhere.

export type PlanKey = "free" | "studio" | "organization";

export interface PlanEntitlements {
  activeDrops:      number;   // Infinity = unlimited
  designs:          number;
  storefronts:      number;
  teamMembers:      number;
  customBranding:   boolean;
  customDomain:     boolean;
  removeHalftone:   boolean;  // white-label
  shopifySync:      boolean;
  analyticsHistory: number;   // days, Infinity = full
  csvExport:        boolean;
  apiAccess:        boolean;
  allProducts:      boolean;
  prioritySupport:  boolean;
  dedicatedManager: boolean;
  bulkDiscounts:    boolean;
}

export interface Plan {
  key:         PlanKey;
  name:        string;
  tagline:     string;
  description: string;   // one sentence — who it is for
  monthlyInr:  number;
  annualInr:   number;   // per-month price when billed annually
  entitlements: PlanEntitlements;
}

export const UNLIMITED = Infinity;

export const PLANS: Record<PlanKey, Plan> = {
  free: {
    key:         "free",
    name:        "Free",
    tagline:     "Launch your first drop",
    description: "Everything you need to start — no credit card required.",
    monthlyInr:  0,
    annualInr:   0,
    entitlements: {
      activeDrops:      1,
      designs:          10,
      storefronts:      1,
      teamMembers:      0,
      customBranding:   false,
      customDomain:     false,
      removeHalftone:   false,
      shopifySync:      false,
      analyticsHistory: 30,
      csvExport:        false,
      apiAccess:        false,
      allProducts:      false,
      prioritySupport:  false,
      dedicatedManager: false,
      bulkDiscounts:    false,
    },
  },

  studio: {
    key:         "studio",
    name:        "Studio",
    tagline:     "Run your brand",
    description: "For creators and brands running multiple drops under their own identity.",
    monthlyInr:  1499,
    annualInr:   999,
    entitlements: {
      activeDrops:      10,
      designs:          UNLIMITED,
      storefronts:      1,
      teamMembers:      0,
      customBranding:   true,
      customDomain:     true,
      removeHalftone:   false,
      shopifySync:      true,
      analyticsHistory: UNLIMITED,
      csvExport:        true,
      apiAccess:        false,
      allProducts:      true,
      prioritySupport:  true,
      dedicatedManager: false,
      bulkDiscounts:    false,
    },
  },

  organization: {
    key:         "organization",
    name:        "Organization",
    tagline:     "Scale with your team",
    description: "For agencies, labels, collectives, and events managing multiple brands.",
    monthlyInr:  3999,
    annualInr:   2499,
    entitlements: {
      activeDrops:      UNLIMITED,
      designs:          UNLIMITED,
      storefronts:      3,
      teamMembers:      10,
      customBranding:   true,
      customDomain:     true,
      removeHalftone:   true,
      shopifySync:      true,
      analyticsHistory: UNLIMITED,
      csvExport:        true,
      apiAccess:        true,
      allProducts:      true,
      prioritySupport:  true,
      dedicatedManager: true,
      bulkDiscounts:    true,
    },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getEntitlements(plan: PlanKey): PlanEntitlements {
  return PLANS[plan].entitlements;
}

/** Is this feature accessible on this plan? */
export function canAccess(plan: PlanKey, feature: keyof PlanEntitlements): boolean {
  const val = getEntitlements(plan)[feature];
  if (typeof val === "boolean") return val;
  if (typeof val === "number")  return val > 0;
  return false;
}

/** Get the numeric limit for a feature (returns 0 if not boolean). */
export function getLimit(plan: PlanKey, feature: keyof PlanEntitlements): number {
  const val = getEntitlements(plan)[feature];
  return typeof val === "number" ? val : val ? 1 : 0;
}

/** Returns the minimum plan key that unlocks the given feature. */
export function requiredPlanFor(feature: keyof PlanEntitlements): PlanKey {
  for (const key of ["free", "studio", "organization"] as PlanKey[]) {
    if (canAccess(key, feature)) return key;
  }
  return "organization";
}

/** Human-readable limit label, e.g. "10" or "Unlimited". */
export function limitLabel(plan: PlanKey, feature: keyof PlanEntitlements): string {
  const val = getEntitlements(plan)[feature];
  if (val === UNLIMITED) return "Unlimited";
  if (typeof val === "boolean") return val ? "Included" : "Not included";
  return String(val);
}

/** Plan ordering for comparison: free < studio < organization. */
export const PLAN_ORDER: PlanKey[] = ["free", "studio", "organization"];

export function planRank(plan: PlanKey): number {
  return PLAN_ORDER.indexOf(plan);
}

export function isUpgrade(from: PlanKey, to: PlanKey): boolean {
  return planRank(to) > planRank(from);
}
