"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <h1
          className="text-4xl font-semibold text-ds-dark mb-2"
          style={{ letterSpacing: "-0.04em" }}
        >
          Privacy Policy
        </h1>
        <p className="text-ds-muted text-sm mb-10">Last updated: March 2025</p>

        <div className="flex flex-col gap-10">

          <section>
            <h2
              className="text-lg font-semibold text-ds-dark mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              1. Information We Collect
            </h2>
            <p className="text-ds-body leading-relaxed text-sm">
              When you use halftonelabs.in, we collect information necessary to process
              and fulfil your orders. This includes:
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ds-body">
              <li className="flex gap-2">
                <span className="text-brand font-semibold mt-0.5">—</span>
                <span>
                  <span className="font-semibold text-ds-dark">Personal details:</span>{" "}
                  your name, email address, and phone number provided at sign-up or checkout.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand font-semibold mt-0.5">—</span>
                <span>
                  <span className="font-semibold text-ds-dark">Shipping address:</span>{" "}
                  full delivery address for order fulfilment.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand font-semibold mt-0.5">—</span>
                <span>
                  <span className="font-semibold text-ds-dark">Uploaded designs:</span>{" "}
                  artwork or images you upload to our studio tool for printing on your order.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand font-semibold mt-0.5">—</span>
                <span>
                  <span className="font-semibold text-ds-dark">Order history:</span>{" "}
                  details of past and current orders for account management and support.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand font-semibold mt-0.5">—</span>
                <span>
                  <span className="font-semibold text-ds-dark">Usage data:</span>{" "}
                  basic analytics such as pages visited, browser type, and device information
                  to help us improve the website experience.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="text-lg font-semibold text-ds-dark mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              2. How We Use Your Information
            </h2>
            <p className="text-ds-body leading-relaxed text-sm">
              The information we collect is used solely for legitimate business purposes:
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ds-body">
              <li className="flex gap-2">
                <span className="text-brand font-semibold mt-0.5">—</span>
                <span>Processing and fulfilling your orders, including production and dispatch.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand font-semibold mt-0.5">—</span>
                <span>Sending order confirmations, shipping notifications, and tracking updates.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand font-semibold mt-0.5">—</span>
                <span>Responding to support queries and handling complaints or replacement requests.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand font-semibold mt-0.5">—</span>
                <span>Improving our website, products, and overall service quality.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand font-semibold mt-0.5">—</span>
                <span>
                  Sending occasional promotional updates — you may opt out of these at any
                  time by emailing{" "}
                  <a
                    href="mailto:hello@halftonelabs.in"
                    className="text-brand hover:underline font-semibold"
                  >
                    hello@halftonelabs.in
                  </a>
                  .
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="text-lg font-semibold text-ds-dark mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              3. Data Sharing
            </h2>
            <p className="text-ds-body leading-relaxed text-sm">
              We do not sell, rent, or trade your personal information to any third party.
              We share your data only with service providers who are essential to operating
              our business:
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ds-body">
              <li className="flex gap-2">
                <span className="text-brand font-semibold mt-0.5">—</span>
                <span>
                  <span className="font-semibold text-ds-dark">Shipping partners</span>{" "}
                  (such as Delhivery, DTDC, or equivalent carriers) receive your name and
                  delivery address solely for the purpose of dispatching and delivering your
                  order.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand font-semibold mt-0.5">—</span>
                <span>
                  <span className="font-semibold text-ds-dark">Razorpay</span> receives
                  transaction-relevant information required to process your payment securely.
                  Razorpay operates independently under its own privacy policy and PCI-DSS
                  compliance.
                </span>
              </li>
            </ul>
            <p className="text-ds-body leading-relaxed text-sm mt-3">
              We may disclose information if required to do so by law or in response to a
              valid legal request by public authorities.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold text-ds-dark mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              4. Data Security
            </h2>
            <p className="text-ds-body leading-relaxed text-sm">
              We take data security seriously. halftonelabs.in is built on industry-standard
              infrastructure with the following safeguards in place:
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ds-body">
              <li className="flex gap-2">
                <span className="text-brand font-semibold mt-0.5">—</span>
                <span>All data transmission is encrypted via HTTPS/TLS.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand font-semibold mt-0.5">—</span>
                <span>
                  User data and uploaded files are stored securely on{" "}
                  <span className="font-semibold text-ds-dark">Supabase</span>, which
                  employs AES-256 encryption at rest and strict access controls.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand font-semibold mt-0.5">—</span>
                <span>Payment information is never stored on our servers — all card and banking data is handled by Razorpay.</span>
              </li>
            </ul>
            <p className="text-ds-body leading-relaxed text-sm mt-3">
              While we implement strong security practices, no method of internet
              transmission is 100% secure. We cannot guarantee absolute security but
              commit to addressing any breach promptly.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold text-ds-dark mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              5. Cookies
            </h2>
            <p className="text-ds-body leading-relaxed text-sm">
              halftonelabs.in uses a minimal number of cookies, primarily for session
              management (keeping you logged in during your visit) and basic performance
              monitoring. We do not use advertising cookies or third-party tracking cookies.
              You can disable cookies in your browser settings, though this may affect some
              site functionality such as staying logged in.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold text-ds-dark mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              6. Your Rights
            </h2>
            <p className="text-ds-body leading-relaxed text-sm">
              You have the right to access, correct, or request deletion of the personal
              data we hold about you. To exercise any of these rights, please email us at{" "}
              <a
                href="mailto:hello@halftonelabs.in"
                className="text-brand hover:underline font-semibold"
              >
                hello@halftonelabs.in
              </a>{" "}
              with the subject line &quot;Data Request&quot;. We will respond within 10 business
              days. Please note that deleting your account data may affect your ability to
              access order history or ongoing support.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold text-ds-dark mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              7. Contact
            </h2>
            <p className="text-ds-body leading-relaxed text-sm">
              For any privacy-related questions or concerns, please contact us at{" "}
              <a
                href="mailto:hello@halftonelabs.in"
                className="text-brand hover:underline font-semibold"
              >
                hello@halftonelabs.in
              </a>
              . Halftone Labs is an online-only brand with no physical store. All
              communications are handled electronically.
            </p>
          </section>

        </div>

        {/* Footer links */}
        <div className="mt-16 pt-8 border-t border-black/[0.06]">
          <p className="text-xs text-ds-muted mb-4 font-semibold uppercase tracking-widest">
            Legal Pages
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/terms" className="text-sm text-brand hover:underline font-semibold">
              Terms &amp; Conditions
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
