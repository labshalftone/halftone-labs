"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Unit = "cm" | "in";

const PRODUCTS = [
  {
    id: "regular-tee",
    name: "Regular Tee",
    rows: [
      { size: "S",   chest: 97,  length: 69, shoulder: 42 },
      { size: "M",   chest: 102, length: 72, shoulder: 44 },
      { size: "L",   chest: 107, length: 74, shoulder: 46 },
      { size: "XL",  chest: 112, length: 76, shoulder: 48 },
      { size: "2XL", chest: 118, length: 78, shoulder: 50 },
    ],
  },
  {
    id: "oversized-tee",
    name: "Oversized Tee",
    rows: [
      { size: "S",   chest: 108, length: 73, shoulder: 48 },
      { size: "M",   chest: 114, length: 76, shoulder: 50 },
      { size: "L",   chest: 120, length: 79, shoulder: 52 },
      { size: "XL",  chest: 126, length: 82, shoulder: 54 },
      { size: "2XL", chest: 132, length: 85, shoulder: 56 },
    ],
  },
  {
    id: "hoodie",
    name: "Hoodie",
    rows: [
      { size: "S",   chest: 102, length: 66, shoulder: 46 },
      { size: "M",   chest: 107, length: 68, shoulder: 48 },
      { size: "L",   chest: 112, length: 71, shoulder: 50 },
      { size: "XL",  chest: 117, length: 73, shoulder: 52 },
      { size: "2XL", chest: 122, length: 75, shoulder: 54 },
    ],
  },
  {
    id: "baby-tee",
    name: "Baby Tee",
    rows: [
      { size: "XS",  chest: 80, length: 48, shoulder: 34 },
      { size: "S",   chest: 84, length: 50, shoulder: 36 },
      { size: "M",   chest: 88, length: 52, shoulder: 38 },
      { size: "L",   chest: 92, length: 54, shoulder: 40 },
      { size: "XL",  chest: 96, length: 56, shoulder: 42 },
    ],
  },
];

function fmt(val: number, unit: Unit) {
  return unit === "cm" ? val : (val / 2.54).toFixed(1);
}

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<Unit>("cm");
  const [activeProduct, setActiveProduct] = useState(PRODUCTS[0].id);
  const product = PRODUCTS.find((p) => p.id === activeProduct) ?? PRODUCTS[0];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-black/[0.06] pt-32 pb-16 px-6">
          <div className="halftone-divider" />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="ds-label ds-label-brand mb-5 block">Size Guide</span>
              <h1
                className="text-[clamp(2.4rem,6vw,4.5rem)] text-ds-dark leading-[0.9] mb-5"
                style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
              >
                Find your perfect fit
              </h1>
              <p className="text-ds-body max-w-lg leading-relaxed">
                All measurements are of the garment, not the body. Recommend going up one size
                if you&apos;re between sizes. Blanks may vary ±2 cm.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Table */}
        <section className="max-w-4xl mx-auto px-6 py-16">

          {/* Product tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {PRODUCTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveProduct(p.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeProduct === p.id
                    ? "bg-ds-dark text-white"
                    : "border border-black/[0.1] text-ds-body hover:border-black/[0.2] hover:text-ds-dark"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Unit toggle */}
          <div className="flex gap-2 mb-8">
            {(["cm", "in"] as Unit[]).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-widest transition-all ${
                  unit === u
                    ? "bg-ds-dark text-white"
                    : "text-ds-muted hover:text-ds-body"
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-black/[0.08]">
                  {["Size", `Chest (${unit})`, `Length (${unit})`, `Shoulder (${unit})`].map((col) => (
                    <th key={col} className="text-left py-3 pr-8 text-xs text-ds-muted font-mono uppercase tracking-widest">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {product.rows.map((row, i) => (
                  <tr key={row.size} className={`border-b border-black/[0.05] ${i % 2 === 0 ? "" : "bg-ds-off-white"}`}>
                    <td className="py-3 pr-8 text-ds-dark font-semibold">{row.size}</td>
                    <td className="py-3 pr-8 text-ds-body">{fmt(row.chest, unit)}</td>
                    <td className="py-3 pr-8 text-ds-body">{fmt(row.length, unit)}</td>
                    <td className="py-3 pr-8 text-ds-body">{fmt(row.shoulder, unit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to measure */}
          <div className="mt-16">
            <h2 className="text-xl text-ds-dark mb-6" style={{ fontWeight: 600, letterSpacing: "-0.03em" }}>
              How to measure
            </h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { title: "Chest", body: "Measure around the fullest part of your chest, keeping the tape horizontal." },
                { title: "Length", body: "Measure from the highest point of the shoulder down to the hem." },
                { title: "Shoulder", body: "Measure from the edge of one shoulder seam to the other across the back." },
              ].map((m) => (
                <div key={m.title} className="bg-ds-off-white border border-black/[0.06] rounded-2xl p-5">
                  <p className="text-ds-dark text-sm font-semibold mb-2">{m.title}</p>
                  <p className="text-ds-body text-xs leading-relaxed">{m.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-ds-muted">
              Still unsure?{" "}
              <a href="mailto:hello@halftonelabs.in" className="text-brand hover:underline">
                Email us
              </a>{" "}
              and we&apos;ll help you pick the right size.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
