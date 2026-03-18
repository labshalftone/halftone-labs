"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <h1
          className="text-4xl font-black text-zinc-900 mb-2"
          style={{ letterSpacing: "-0.04em" }}
        >
          Shipping Policy
        </h1>
        <p className="text-zinc-400 text-sm mb-10">Last updated: March 2025</p>

        <div className="flex flex-col gap-10">

          <section>
            <h2
              className="text-lg font-black text-zinc-900 mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              1. Processing Time
            </h2>
            <p className="text-zinc-600 leading-relaxed text-sm">
              All Halftone Labs products are custom-printed to order. Once your payment is
              confirmed, your order enters our production queue. Please allow{" "}
              <span className="font-semibold text-zinc-800">3–5 business days</span> for
              production (printing, curing, and quality check) before your order is handed
              over to our shipping partner. Orders placed on weekends or public holidays
              begin processing on the next business day.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-black text-zinc-900 mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              2. Domestic Shipping (India)
            </h2>
            <p className="text-zinc-600 leading-relaxed text-sm">
              For deliveries within India, shipping typically takes an additional{" "}
              <span className="font-semibold text-zinc-800">2–3 business days</span> after
              dispatch, making the total estimated delivery window{" "}
              <span className="font-semibold text-zinc-800">5–7 business days</span> from
              order confirmation.
            </p>
            <p className="text-zinc-600 leading-relaxed text-sm mt-3">
              We ship via trusted logistics partners including{" "}
              <span className="font-semibold text-zinc-800">Delhivery</span>,{" "}
              <span className="font-semibold text-zinc-800">DTDC</span>, and similar
              carriers, depending on your delivery location. The carrier is selected
              automatically for the best coverage and speed in your area.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-black text-zinc-900 mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              3. International Shipping
            </h2>
            <p className="text-zinc-600 leading-relaxed text-sm">
              We ship internationally. After production (3–5 business days), international
              orders typically take an additional{" "}
              <span className="font-semibold text-zinc-800">7–14 business days</span> in
              transit, depending on your country and local customs processing times. The
              total estimated delivery window for international orders is{" "}
              <span className="font-semibold text-zinc-800">10–20 business days</span>{" "}
              from order confirmation.
            </p>
            <p className="text-zinc-600 leading-relaxed text-sm mt-3">
              <span className="font-semibold text-zinc-800">
                Customs duties, import taxes, and local fees
              </span>{" "}
              are entirely the responsibility of the customer. Halftone Labs has no control
              over customs charges and cannot predict their value. Please check your
              country&apos;s import regulations before ordering.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-black text-zinc-900 mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              4. Order Tracking
            </h2>
            <p className="text-zinc-600 leading-relaxed text-sm">
              Once your order has been dispatched, you will receive a shipping confirmation
              email containing your{" "}
              <span className="font-semibold text-zinc-800">tracking number and a tracking link</span>.
              You can use this link to monitor your shipment&apos;s progress in real time.
              Tracking updates may take up to 24 hours to appear after dispatch.
            </p>
            <p className="text-zinc-600 leading-relaxed text-sm mt-3">
              If you do not receive a tracking email within 7 business days of your order
              confirmation, please contact us at{" "}
              <a
                href="mailto:hello@halftonelabs.in"
                className="text-orange-500 hover:underline font-semibold"
              >
                hello@halftonelabs.in
              </a>
              .
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-black text-zinc-900 mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              5. Non-Delivery &amp; Failed Attempts
            </h2>
            <p className="text-zinc-600 leading-relaxed text-sm">
              Our courier partners will attempt delivery up to{" "}
              <span className="font-semibold text-zinc-800">3 times</span>. If delivery
              cannot be completed after 3 attempts (due to an incorrect address, recipient
              unavailability, or refusal to accept), the package will be returned to us.
            </p>
            <p className="text-zinc-600 leading-relaxed text-sm mt-3">
              In the event of a returned package, we will contact you via email. Re-shipping
              the order will be charged separately at the applicable shipping rate. Halftone
              Labs is not responsible for non-delivery due to incorrect address information
              provided by the customer at checkout.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-black text-zinc-900 mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              6. Delays
            </h2>
            <p className="text-zinc-600 leading-relaxed text-sm">
              During high-volume periods (sales, festive seasons, or new product launches),
              production and shipping timelines may be longer than usual. We will do our
              best to communicate any anticipated delays via email. External factors such
              as weather disruptions, logistics network issues, or public holidays may also
              affect delivery timelines and are outside our control.
            </p>
            <p className="text-zinc-600 leading-relaxed text-sm mt-3">
              If your order is significantly delayed beyond the estimated window, please
              reach out to us at{" "}
              <a
                href="mailto:hello@halftonelabs.in"
                className="text-orange-500 hover:underline font-semibold"
              >
                hello@halftonelabs.in
              </a>{" "}
              and we&apos;ll investigate with our shipping partner.
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
            <Link href="/return-policy" className="text-sm text-orange-500 hover:underline font-semibold">
              Return &amp; Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
