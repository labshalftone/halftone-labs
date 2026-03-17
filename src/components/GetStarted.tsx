"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function GetStarted() {
  return (
    <section className="bg-zinc-900 py-24 px-6 overflow-hidden relative">
      {/* subtle dot-grid halftone overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-4 block">
              Get started
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-white leading-[0.92] mb-5"
              style={{ letterSpacing: "-0.055em" }}
            >
              Order your
              <br />
              product sample
              <br />
              <span className="text-orange-400">today</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed max-w-md text-[0.95rem] mb-4">
              Our garments are classic unisex fits, all made in India. Order a
              sample to try before you buy — then design your full order in the
              Halftone Studio.
            </p>
            <p className="text-zinc-500 text-sm mb-8">
              Blank samples from{" "}
              <span className="text-orange-400 font-semibold">₹499</span>
              {" · "}Printed samples from{" "}
              <span className="text-orange-400 font-semibold">₹799</span>
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/studio">
                <button className="px-6 py-3.5 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-400 transition-colors">
                  Open the Studio →
                </button>
              </Link>
              <a
                href="mailto:hello@halftonelabs.in"
                className="px-6 py-3.5 rounded-xl border border-zinc-700 text-zinc-300 font-semibold text-sm hover:border-zinc-500 hover:text-white transition-colors"
              >
                Talk to us
              </a>
            </div>
          </motion.div>

          {/* Right — feature list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col gap-4"
          >
            {[
              {
                icon: "👕",
                title: "MOQ 1 — no bulk required",
                desc: "Order a single sample unit to check fit, feel, and print quality before committing.",
              },
              {
                icon: "🖨️",
                title: "DTG & DTF printing",
                desc: "Photographic-quality print on premium 180–240 GSM combed cotton blanks.",
              },
              {
                icon: "📦",
                title: "Ships in 5–7 business days",
                desc: "Fast domestic delivery via Shiprocket. International orders ship in 10–18 days.",
              },
              {
                icon: "🇮🇳",
                title: "100% made in India",
                desc: "Every garment cut, printed, and fulfilled from our facility — no middlemen.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                className="flex gap-4 items-start bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="font-bold text-white text-sm">{item.title}</p>
                  <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
