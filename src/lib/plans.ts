// ─── Single source of truth for all plan definitions ─────────────────────────
// Everything subscription-related in the product derives from this file.
// Import PLANS or the helper functions — never hardcode plan logic elsewhere.

export type PlanKey = "free" | "launch" | "scale" | "business" | "enterprise";

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
  description: string;
  monthlyInr:  number;
  annualInr:   number;   // per-month price when billed annually (0 = contact sales)
  entitlements: PlanEntitlements;
}

export const UNLIMITED = Infinity;

export const PLANS: Record<PlanKey, Plan> = {
  free: {
    key:         "free",
    name:        "Free",
    tagline:     "Your first drop",
    description: "Everything you need to start. No credit card required.",
    monthlyInr:  0,
    annualInr:   0,
    entitlements: {
      activeDrops:      1,
      designs:          UNLIMITED,
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
    description: "Run your brand independently — custom identity, full analytics.",
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
      allProducts:      false,
      neckLabels:       false,
      premiumPackaging: false,
      prioritySupport:  false,
      dedicatedManager: false,
      bulkDiscounts:    false,
    },
  },

  scale: {
    key:         "scale",
    name:        "Scale",
    tagline:     "The core plan for serious creators",
    description: "Unlimited drops, premium products, branding unlocked — built for creators who are scaling.",
    monthlyInr:  7499,
    annualInr:   5999,
    entitlements: {
      activeDrops:      UNLIMITED,
      designs:          UNLIMITED,
      storefronts:      3,
      teamMembers:      5,
      customBranding:   true,
      customDomain:     true,
      removeHalftone:   false,
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
    description: "Multiple storefronts, white-label, API access — for teams that move at scale.",
    monthlyInr:  29999,
    annualInr:   24999,
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

  enterprise: {
    key:         "enterprise",
    name:        "Enterprise",
    tagline:     "For brands running serious volume",
    description: "Custom product development, hybrid inventory, omni-channel, dedicated ops team.",
    monthlyInr:  150000,
    annualInr:   0,  // contact sales only
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
  for (const key of ["free", "launch", "scale", "business", "enterprise"] as PlanKey[]) {
    if (canAccess(key, feature)) return key;
  }
  return "enterprise";
}

/** Human-readable limit label, e.g. "10" or "Unlimited". */
export function limitLabel(plan: PlanKey, feature: keyof PlanEntitlements): string {
  const val = getEntitlements(plan)[feature];
  if (val === UNLIMITED) return "Unlimited";
  if (typeof val === "boolean") return val ? "Included" : "Not included";
  return String(val);
}

/** Plan ordering for comparison: free < launch < scale < business < enterprise. */
export const PLAN_ORDER: PlanKey[] = ["free", "launch", "scale", "business", "enterprise"];

export function planRank(plan: PlanKey): number {
  return PLAN_ORDER.indexOf(plan);
}

export function isUpgrade(from: PlanKey, to: PlanKey): boolean {
  return planRank(to) > planRank(from);
}
