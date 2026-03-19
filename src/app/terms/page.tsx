"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <h1
          className="text-4xl font-semibold text-ds-dark mb-2"
          style={{ letterSpacing: "-0.04em" }}
        >
          Terms &amp; Conditions
        </h1>
        <p className="text-ds-muted text-sm mb-10">Last updated: March 2025</p>

        <div className="flex flex-col gap-10">

          <section>
            <h2
              className="text-lg font-semibold text-ds-dark mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              1. Acceptance of Terms
            </h2>
            <p className="text-ds-body leading-relaxed text-sm">
              By accessing or placing an order on{" "}
              <span className="font-semibold text-ds-dark">halftonelabs.in</span>, you
              agree to be bound by these Terms &amp; Conditions in full. If you do not agree
              with any part of these terms, please do not use our website or services. We
              reserve the right to update these terms at any time without prior notice, and
              continued use of the site constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold text-ds-dark mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              2. Products &amp; Orders
            </h2>
            <p className="text-ds-body leading-relaxed text-sm">
              All products offered by Halftone Labs are custom-made to order using DTG
              (Direct-to-Garment) or DTF (Direct-to-Film) printing technologies. Because
              every item is printed individually on demand, no two prints are identical —
              minor variations in color, placement, and texture are inherent to the process
              and are not considered defects. Product images shown on the website are for
              representational purposes only; the final product may vary slightly due to
              screen calibration and fabric characteristics.
            </p>
            <p className="text-ds-body leading-relaxed text-sm mt-3">
              By placing an order, you confirm that you have reviewed all product details,
              sizing information, and design previews before checkout. Once an order is
              confirmed, it enters production immediately and changes cannot be accommodated
              beyond the cancellation window described below.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold text-ds-dark mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              3. Pricing
            </h2>
            <p className="text-ds-body leading-relaxed text-sm">
              All prices on halftonelabs.in are listed in Indian Rupees (INR) and are
              inclusive of applicable GST unless stated otherwise. Shipping charges, if
              any, are calculated and displayed at checkout before payment. Halftone Labs
              reserves the right to revise prices at any time without prior notice.
              However, the price at the time of your order confirmation is the price you
              will be charged.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold text-ds-dark mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              4. Payment
            </h2>
            <p className="text-ds-body leading-relaxed text-sm">
              All transactions on halftonelabs.in are processed securely through{" "}
              <span className="font-semibold text-ds-dark">Razorpay</span>. We accept
              major credit cards, debit cards, UPI, net banking, and other methods
              supported by Razorpay. Your order is confirmed only upon successful payment
              authorisation. Halftone Labs does not store any card or banking details — all
              payment data is handled exclusively by Razorpay in compliance with PCI-DSS
              standards.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold text-ds-dark mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              5. No Returns Policy
            </h2>
            <p className="text-ds-body leading-relaxed text-sm">
              All sales on Halftone Labs are{" "}
              <span className="font-semibold text-ds-dark">final</span>. Because every
              product is custom-printed to order specifically for you, we are unable to
              accept returns or exchanges for reasons such as change of mind, incorrect
              size selection, or colour preference. We strongly encourage you to review our
              size guide and design preview carefully before placing an order.
            </p>
            <p className="text-ds-body leading-relaxed text-sm mt-3">
              The only exception is if you receive a genuinely defective item (significant
              print flaw, damaged garment) or the wrong item entirely. In such cases,
              please contact us at{" "}
              <a
                href="mailto:hello@halftonelabs.in"
                className="text-brand hover:underline font-semibold"
              >
                hello@halftonelabs.in
              </a>{" "}
              within 48 hours of delivery with photographic evidence. We will assess and,
              where valid, replace the item at no additional cost to you.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold text-ds-dark mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              6. Intellectual Property
            </h2>
            <p className="text-ds-body leading-relaxed text-sm">
              By uploading a design or artwork to halftonelabs.in, you represent and
              warrant that you are the rightful owner of that design or have obtained all
              necessary permissions, licences, and rights to use and reproduce it. Halftone
              Labs will not be held responsible for any intellectual property infringement
              arising from customer-submitted designs. You grant Halftone Labs a
              non-exclusive, royalty-free licence to reproduce your submitted artwork
              solely for the purpose of fulfilling your order.
            </p>
            <p className="text-ds-body leading-relaxed text-sm mt-3">
              All website content, branding, and original designs created by Halftone Labs
              remain the exclusive intellectual property of Halftone Labs and may not be
              copied, reproduced, or distributed without prior written consent.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold text-ds-dark mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              7. Limitation of Liability
            </h2>
            <p className="text-ds-body leading-relaxed text-sm">
              To the fullest extent permitted by applicable law, Halftone Labs and its
              directors, employees, and partners shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising out of your
              use of our products or services, including but not limited to loss of data,
              revenue, or business opportunities. Our total liability in respect of any
              claim shall not exceed the amount paid by you for the specific order giving
              rise to the claim.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold text-ds-dark mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              8. Governing Law
            </h2>
            <p className="text-ds-body leading-relaxed text-sm">
              These Terms &amp; Conditions are governed by and construed in accordance with
              the laws of India. Any disputes arising out of or in connection with these
              terms shall be subject to the exclusive jurisdiction of the courts located in{" "}
              <span className="font-semibold text-ds-dark">Mumbai, Maharashtra, India</span>.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold text-ds-dark mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              Contact Us
            </h2>
            <p className="text-ds-body leading-relaxed text-sm">
              For any questions regarding these terms, reach us at{" "}
              <a
                href="mailto:hello@halftonelabs.in"
                className="text-brand hover:underline font-semibold"
              >
                hello@halftonelabs.in
              </a>
              .
            </p>
          </section>

        </div>

        {/* Footer links */}
        <div className="mt-16 pt-8 border-t border-black/[0.06]">
          <p className="text-xs text-ds-muted mb-4 font-semibold uppercase tracking-widest">
            Legal Pages
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="text-sm text-brand hover:underline font-semibold">
              Privacy Policy
            </Link>
            <Link href="/shipping-policy" className="text-sm text-brand hover:underline font-semibold">
              Shipping Policy
            </Link>
            <Link href="/return-policy" className="text-sm text-brand hover:underline font-semibold">
              Return &amp; Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
