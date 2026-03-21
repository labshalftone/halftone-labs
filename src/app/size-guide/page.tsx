"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Unit = "cm" | "in";

const PRODUCTS = [
  {
    id: "regular-tee",
    name: "Regular Fit T-Shirt",
    columns: ["Size", "Chest (cm)", "Length (cm)", "Shoulder (cm)"],
    columnsCm: ["Size", "Chest (cm)", "Length (cm)", "Shoulder (cm)"],
    columnsIn: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
    rows: [
      { size: "XS", chest: 92, length: 66, shoulder: 40 },
      { size: "S", chest: 97, length: 69, shoulder: 42 },
      { size: "M", chest: 102, length: 72, shoulder: 44 },
      { size: "L", chest: 107, length: 74, shoulder: 46 },
      { size: "XL", chest: 112, length: 76, shoulder: 48 },
      { size: "XXL", chest: 118, length: 78, shoulder: 50 },
      { size: "3XL", chest: 124, length: 80, shoulder: 52 },
    ],
  },
  {
    id: "oversized-tee",
    name: "Oversized T-Shirt",
    rows: [
      { size: "XS", chest: 102, length: 70, shoulder: 46 },
      { size: "S", chest: 108, length: 73, shoulder: 48 },
      { size: "M", chest: 114, length: 76, shoulder: 50 },
      { size: "L", chest: 120, length: 79, shoulder: 52 },
      { size: "XL", chest: 126, length: 82, shoulder: 54 },
      { size: "XXL", chest: 132, length: 85, shoulder: 56 },
    ],
  },
  {
    id: "hoodie",
    name: "Hoodie",
    rows: [
      { size: "S", chest: 102, length: 66, shoulder: 46 },
      { size: "M", chest: 107, length: 68, shoulder: 48 },
      { size: "L", chest: 112, length: 71, shoulder: 50 },
      { size: "XL", chest: 117, length: 73, shoulder: 52 },
      { size: "XXL", chest: 122, length: 75, shoulder: 54 },
      { size: "3XL", chest: 128, length: 77, shoulder: 56 },
    ],
  },
];

function cm2in(val: number) {
  return (val / 2.54).toFixed(1);
}

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<Unit>("cm");
  const [activeProduct, setActiveProduct] = useState(PRODUCTS[0].id);

  const product = PRODUCTS.find((p) => p.id === activeProduct) ?? PRODUCTS[0];

  return (
    <>
      <Navbar />
      <main className="bg-ds-dark min-h-screen text-white">
        <section className="pt-36 pb-20 max-w-[900px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="ds-label text-white/30 block mb-6">Size Guide</span>
            <h1
              className="text-4xl md:text-5xl leading-[0.92] mb-4"
              style={{ fontWeight: 700, letterSpacing: "-0.055em" }}
            >
              Find your perfect fit
            </h1>
            <p className="text-white/45 text-sm leading-relaxed max-w-lg mb-10">
              All measurements are of the garment, not the body. We recommend going up one
              size if you&apos;re between sizes. Blanks may vary ±2 cm due to manufacturing
              tolerances.
            </p>

            {/* Product tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProduct(p.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeProduct === p.id
                      ? "bg-white text-black"
                      : "border border-white/[0.1] text-white/50 hover:text-white hover:border-white/30"
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
                      ? "bg-white/10 text-white"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    {["Size", `Chest (${unit})`, `Length (${unit})`, `Shoulder (${unit})`].map((col) => (
                      <th
                        key={col}
                        className="text-left py-3 pr-6 text-xs text-white/30 font-mono uppercase tracking-widest"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {product.rows.map((row, i) => (
                    <tr
                      key={row.size}
                      className={`border-b border-white/[0.05] ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}
                    >
                      <td className="py-3 pr-6 text-white font-semibold">{row.size}</td>
                      <td className="py-3 pr-6 text-white/60">
                        {unit === "cm" ? row.chest : cm2in(row.chest)}
                      </td>
                      <td className="py-3 pr-6 text-white/60">
                        {unit === "cm" ? row.length : cm2in(row.length)}
                      </td>
                      <td className="py-3 pr-6 text-white/60">
                        {unit === "cm" ? row.shoulder : cm2in(row.shoulder)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* How to measure */}
            <div className="mt-14">
              <h2
                className="text-xl mb-6"
                style={{ fontWeight: 600, letterSpacing: "-0.03em" }}
              >
                How to measure
              </h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {[
                  { title: "Chest", body: "Measure around the fullest part of your chest, keeping the tape horizontal." },
                  { title: "Length", body: "Measure from the highest point of the shoulder down to the hem." },
                  { title: "Shoulder", body: "Measure from the edge of one shoulder seam to the other across the back." },
                ].map((m) => (
                  <div key={m.title} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
                    <p className="text-white text-sm font-semibold mb-2">{m.title}</p>
                    <p className="text-white/40 text-xs leading-relaxed">{m.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-8 text-xs text-white/25">
              Still unsure? Email us at{" "}
              <a href="mailto:hello@halftonelabs.in" className="text-white/50 hover:text-white underline">
                hello@halftonelabs.in
              </a>{" "}
              and we&apos;ll help you pick the right size.
            </p>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
