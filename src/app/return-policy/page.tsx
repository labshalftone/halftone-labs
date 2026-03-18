"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <h1
          className="text-4xl font-black text-zinc-900 mb-2"
          style={{ letterSpacing: "-0.04em" }}
        >
          Return &amp; Refund Policy
        </h1>
        <p className="text-zinc-400 text-sm mb-10">Last updated: March 2025</p>

        {/* Summary card */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 mb-10">
          <p className="text-sm text-zinc-600 leading-relaxed">
            <span className="font-black text-zinc-900">Short version:</span> All Halftone
            Labs products are custom-printed on demand. We do not accept returns or
            exchanges. The only exceptions are genuinely defective or wrong items — contact
            us within 48 hours and we&apos;ll make it right.
          </p>
        </div>

        <div className="flex flex-col gap-10">

          <section>
            <h2
              className="text-lg font-black text-zinc-900 mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              1. No Returns
            </h2>
            <p className="text-zinc-600 leading-relaxed text-sm">
              All products on halftonelabs.in are{" "}
              <span className="font-semibold text-zinc-800">custom-printed to order</span>.
              This means every item is made specifically for you after purchase — we do not
              hold pre-printed stock. As a result, we are{" "}
              <span className="font-semibold text-zinc-800">
                unable to accept returns or exchanges
              </span>{" "}
              for any reason, including but not limited to: change of mind, incorrect size
              selection, colour expectations, or personal preference.
            </p>
            <p className="text-zinc-600 leading-relaxed text-sm mt-3">
              Please review all product details, your design preview, and our size guide
              carefully before completing your purchase.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-black text-zinc-900 mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              2. Defective or Wrong Items
            </h2>
            <p className="text-zinc-600 leading-relaxed text-sm">
              We stand behind our print quality. If you receive an item that has a{" "}
              <span className="font-semibold text-zinc-800">
                significant print defect, is damaged, or is the wrong item
              </span>{" "}
              (wrong design, wrong size, wrong garment), we will replace it at no cost to
              you.
            </p>
            <p className="text-zinc-600 leading-relaxed text-sm mt-3">
              To be eligible for a replacement, you must:
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-600">
              <li className="flex gap-2">
                <span className="text-orange-500 font-black mt-0.5">—</span>
                <span>
                  Email us at{" "}
                  <a
                    href="mailto:hello@halftonelabs.in"
                    className="text-orange-500 hover:underline font-semibold"
                  >
                    hello@halftonelabs.in
                  </a>{" "}
                  within{" "}
                  <span className="font-semibold text-zinc-800">48 hours of delivery</span>.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500 font-black mt-0.5">—</span>
                <span>Include your order number and clear photographs of the defect or wrong item.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500 font-black mt-0.5">—</span>
                <span>Allow us 2–3 business days to review and respond to your claim.</span>
              </li>
            </ul>
            <p className="text-zinc-600 leading-relaxed text-sm mt-3">
              Claims submitted after 48 hours of delivery or without supporting photographs
              will not be eligible for replacement. Minor colour variations due to screen
              calibration or the nature of DTG/DTF printing are not considered defects.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-black text-zinc-900 mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              3. Cancellations
            </h2>
            <p className="text-zinc-600 leading-relaxed text-sm">
              You may cancel your order within{" "}
              <span className="font-semibold text-zinc-800">1 hour of placement</span>.
              After this window, your order enters our production queue and cancellation is
              no longer possible. To cancel, email{" "}
              <a
                href="mailto:hello@halftonelabs.in"
                className="text-orange-500 hover:underline font-semibold"
              >
                hello@halftonelabs.in
              </a>{" "}
              immediately with your order number and the subject line &quot;Cancel Order&quot;.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-black text-zinc-900 mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              4. Refunds
            </h2>
            <p className="text-zinc-600 leading-relaxed text-sm">
              Refunds are issued only in the following circumstances:
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-600">
              <li className="flex gap-2">
                <span className="text-orange-500 font-black mt-0.5">—</span>
                <span>
                  Your order was cancelled within the 1-hour cancellation window.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500 font-black mt-0.5">—</span>
                <span>
                  Your item was confirmed defective or incorrect, and a replacement is not
                  feasible (at our discretion).
                </span>
              </li>
            </ul>
            <p className="text-zinc-600 leading-relaxed text-sm mt-3">
              Approved refunds are processed within{" "}
              <span className="font-semibold text-zinc-800">5–7 business days</span> and
              credited back to the original payment method used at checkout (via Razorpay).
              Depending on your bank or card provider, it may take additional time for the
              credit to appear in your account.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-black text-zinc-900 mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              5. Size Issues
            </h2>
            <p className="text-zinc-600 leading-relaxed text-sm">
              We provide a detailed size guide on our website to help you choose the right
              fit before placing your order. Please refer to it carefully — measurements
              are provided in centimetres for chest, length, and sleeve.
            </p>
            <p className="text-zinc-600 leading-relaxed text-sm mt-3">
              Because all our garments are made to order, we{" "}
              <span className="font-semibold text-zinc-800">
                cannot accept returns or exchanges due to size dissatisfaction
              </span>
              . If you are between sizes, we recommend sizing up. If you have any questions
              about fit before ordering, reach out to us at{" "}
              <a
                href="mailto:hello@halftonelabs.in"
                className="text-orange-500 hover:underline font-semibold"
              >
                hello@halftonelabs.in
              </a>
              .
            </p>
          </section>

        </div>

        {/* Footer links */}
        <div className="mt-16 pt-8 border-t border-zinc-200">
          <p className="text-xs text-zinc-400 mb-4 font-semibold uppercase tracking-widest">
            Legal Pages
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/terms" className="text-sm text-orange-500 hover:underline font-semibold">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="text-sm text-orange-500 hover:underline font-semibold">
              Privacy Policy
            </Link>
            <Link href="/shipping-policy" className="text-sm text-orange-500 hover:underline font-semibold">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
