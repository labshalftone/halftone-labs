// ─── Single source of truth for all plan definitions ─────────────────────────
// Everything subscription-related in the product derives from this file.
// Import PLANS or the helper functions — never hardcode plan logic elsewhere.

export type PlanKey = "free" | "launch" | "scale" | "business";

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
  neckLabels:       boolean;  // DTF neck label printing
  premiumPackaging: boolean;  // premium zipper packaging
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
    tagline:     "Your first drop",
    description: "Everything you need to start — no credit card required.",
    monthlyInr:  0,
    annualInr:   0,
    entitlements: {
      activeDrops:      1,
      designs:          5,
      storefronts:      1,
      teamMembers:      0,
      customBranding:   false,
      customDomain:     false,
      removeHalftone:   false,
      shopifySync:      false,
      analyticsHistory: 7,
      csvExport:        false,
      apiAccess:        false,
      allProducts:      false,
      neckLabels:       false,
      premiumPackaging: false,
      prioritySupport:  false,
      dedicatedManager: false,
      bulkDiscounts:    false,
    },
  },

  launch: {
    key:         "launch",
    name:        "Launch",
    tagline:     "For solo creators and early brands",
    description: "Run your brand independently — custom identity, unlimited designs, full analytics.",
    monthlyInr:  1999,
    annualInr:   1499,
    entitlements: {
      activeDrops:      5,
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
      neckLabels:       true,
      premiumPackaging: false,
      prioritySupport:  false,
      dedicatedManager: false,
      bulkDiscounts:    false,
    },
  },

  scale: {
    key:         "scale",
    name:        "Scale",
    tagline:     "For growing teams and multi-brand creators",
    description: "Multiple storefronts, team access, white-label — built for creators who are scaling.",
    monthlyInr:  5999,
    annualInr:   4999,
    entitlements: {
      activeDrops:      20,
      designs:          UNLIMITED,
      storefronts:      3,
      teamMembers:      5,
      customBranding:   true,
      customDomain:     true,
      removeHalftone:   true,
      shopifySync:      true,
      analyticsHistory: UNLIMITED,
      csvExport:        true,
      apiAccess:        true,
      allProducts:      true,
      neckLabels:       true,
      premiumPackaging: true,
      prioritySupport:  true,
      dedicatedManager: false,
      bulkDiscounts:    false,
    },
  },

  business: {
    key:         "business",
    name:        "Business",
    tagline:     "For orgs, agencies, festivals, and labels",
    description: "Unlimited drops, unlimited storefronts, dedicated manager — for teams that move at scale.",
    monthlyInr:  12999,
    annualInr:   9999,
    entitlements: {
      activeDrops:      UNLIMITED,
      designs:          UNLIMITED,
      storefronts:      UNLIMITED,
      teamMembers:      UNLIMITED,
      customBranding:   true,
      customDomain:     true,
      removeHalftone:   true,
      shopifySync:      true,
      analyticsHistory: UNLIMITED,
      csvExport:        true,
      apiAccess:        true,
      allProducts:      true,
      neckLabels:       true,
      premiumPackaging: true,
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
  for (const key of ["free", "launch", "scale", "business"] as PlanKey[]) {
    if (canAccess(key, feature)) return key;
  }
  return "business";
}

/** Human-readable limit label, e.g. "10" or "Unlimited". */
export function limitLabel(plan: PlanKey, feature: keyof PlanEntitlements): string {
  const val = getEntitlements(plan)[feature];
  if (val === UNLIMITED) return "Unlimited";
  if (typeof val === "boolean") return val ? "Included" : "Not included";
  return String(val);
}

/** Plan ordering for comparison: free < launch < scale < business. */
export const PLAN_ORDER: PlanKey[] = ["free", "launch", "scale", "business"];

export function planRank(plan: PlanKey): number {
  return PLAN_ORDER.indexOf(plan);
}

export function isUpgrade(from: PlanKey, to: PlanKey): boolean {
  return planRank(to) > planRank(from);
}
