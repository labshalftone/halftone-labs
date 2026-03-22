// ─── Shared Razorpay checkout utility ─────────────────────────────────────────
// Used by PlanCheckoutModal (in-app), pricing page, and anywhere else that
// needs to open a subscription checkout without routing through /pricing.

import type { Currency } from "@/lib/currency-context";

declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open(): void };
  }
}

/** Load the Razorpay checkout.js script (idempotent — safe to call multiple times). */
async function loadRazorpay(): Promise<void> {
  if (typeof window !== "undefined" && window.Razorpay) return;
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="razorpay"]')) {
      // Script tag already exists, wait for it
      const poll = setInterval(() => {
        if (window.Razorpay) { clearInterval(poll); resolve(); }
      }, 50);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
    document.head.appendChild(script);
  });
}

export interface CheckoutOptions {
  plan:      "launch" | "scale" | "business";
  billing:   "monthly" | "annual";
  currency:  Currency;
  userId:    string;
  userEmail: string;
  /** Called after signature verification succeeds. */
  onSuccess?: () => void | Promise<void>;
  /** Called when the Razorpay modal is dismissed without payment. */
  onDismiss?: () => void;
}

/**
 * Open a Razorpay subscription checkout.
 *
 * 1. Calls /api/subscribe to create the Razorpay subscription.
 * 2. Loads checkout.js (cached after first call).
 * 3. Opens the Razorpay modal.
 * 4. On success: calls /api/subscribe/verify, then opts.onSuccess.
 * 5. On dismiss: calls opts.onDismiss.
 */
export async function openSubscriptionCheckout(opts: CheckoutOptions): Promise<void> {
  const res = await fetch("/api/subscribe", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({
      plan:     opts.plan,
      billing:  opts.billing,
      currency: opts.currency,
      userId:   opts.userId,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);

  await loadRazorpay();

  const planLabel =
    `${opts.plan.charAt(0).toUpperCase() + opts.plan.slice(1)} — ` +
    `${opts.billing === "annual" ? "Annual" : "Monthly"}`;

  return new Promise((resolve) => {
    const rzp = new window.Razorpay({
      key:             data.keyId,
      subscription_id: data.subscriptionId,
      name:            "Halftone Labs",
      description:     planLabel,
      image:           "/logo.png",
      prefill:         { email: opts.userEmail },
      theme:           { color: "#0f0f0f" },
      handler: async (response: Record<string, string>) => {
        await fetch("/api/subscribe/verify", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...response,
            userId:  opts.userId,
            plan:    opts.plan,
            billing: opts.billing,
          }),
        });
        await opts.onSuccess?.();
        resolve();
      },
      modal: {
        ondismiss: () => {
          opts.onDismiss?.();
          resolve();
        },
      },
    });
    rzp.open();
  });
}
