"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
};

type ProductKey = "regular" | "oversized-sj" | "oversized-ft" | "baby";

interface SizeRow {
  size: string;
  chest: number;
  length: number;
  shoulder: number;
}

const TABS: { key: ProductKey; label: string }[] = [
  { key: "regular",      label: "Regular Tee" },
  { key: "oversized-sj", label: "Oversized Tee (SJ)" },
  { key: "oversized-ft", label: "Oversized Tee (FT)" },
  { key: "baby",         label: "Baby Tee" },
];

const DATA: Record<ProductKey, SizeRow[]> = {
  regular: [
    { size: "XS",  chest: 34, length: 26, shoulder: 15 },
    { size: "S",   chest: 36, length: 27, shoulder: 16 },
    { size: "M",   chest: 38, length: 28, shoulder: 17 },
    { size: "L",   chest: 40, length: 29, shoulder: 18 },
    { size: "XL",  chest: 42, length: 30, shoulder: 19 },
    { size: "2XL", chest: 44, length: 31, shoulder: 20 },
    { size: "3XL", chest: 46, length: 32, shoulder: 21 },
  ],
  "oversized-sj": [
    { size: "S",   chest: 44, length: 28, shoulder: 20 },
    { size: "M",   chest: 46, length: 29, shoulder: 21 },
    { size: "L",   chest: 48, length: 30, shoulder: 22 },
    { size: "XL",  chest: 50, length: 31, shoulder: 23 },
    { size: "2XL", chest: 52, length: 32, shoulder: 24 },
  ],
  "oversized-ft": [
    { size: "S",   chest: 44, length: 28, shoulder: 20 },
    { size: "M",   chest: 46, length: 29, shoulder: 21 },
    { size: "L",   chest: 48, length: 30, shoulder: 22 },
    { size: "XL",  chest: 50, length: 31, shoulder: 23 },
    { size: "2XL", chest: 52, length: 32, shoulder: 24 },
  ],
  baby: [
    { size: "XS", chest: 30, length: 20, shoulder: 12 },
    { size: "S",  chest: 32, length: 21, shoulder: 13 },
    { size: "M",  chest: 34, length: 22, shoulder: 14 },
    { size: "L",  chest: 36, length: 23, shoulder: 15 },
    { size: "XL", chest: 38, length: 24, shoulder: 16 },
  ],
};

const IN_TO_CM = 2.54;

function fmt(val: number, cm: boolean) {
  return cm ? (val * IN_TO_CM).toFixed(1) : String(val);
}

export default function SizeGuide({ open, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<ProductKey>("regular");
  const [useCm, setUseCm] = useState(false);

  const rows = DATA[activeTab];
  const unit = useCm ? "cm" : "inches";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative z-10 w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-zinc-900 text-white px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-[0.6rem] font-mono uppercase tracking-widest text-zinc-400 mb-0.5">Halftone Labs</p>
                <h2 className="text-lg font-black" style={{ letterSpacing: "-0.03em" }}>Size Guide</h2>
              </div>
              <div className="flex items-center gap-3">
                {/* CM / Inches toggle */}
                <button
                  onClick={() => setUseCm((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-xs font-bold"
                >
                  <span className={useCm ? "text-zinc-400" : "text-white"}>IN</span>
                  <span className="text-zinc-600">/</span>
                  <span className={useCm ? "text-white" : "text-zinc-400"}>CM</span>
                </button>
                {/* Close */}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-300 hover:text-white"
                  aria-label="Close size guide"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-3 bg-zinc-50 border-b border-zinc-100 flex-shrink-0 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                    activeTab === tab.key
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1 p-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="text-left pb-3 text-xs font-black uppercase tracking-widest text-zinc-400">Size</th>
                    <th className="text-right pb-3 text-xs font-black uppercase tracking-widest text-zinc-400">Chest ({unit})</th>
                    <th className="text-right pb-3 text-xs font-black uppercase tracking-widest text-zinc-400">Length ({unit})</th>
                    <th className="text-right pb-3 text-xs font-black uppercase tracking-widest text-zinc-400">Shoulder ({unit})</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row.size}
                      className={`border-b border-zinc-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-zinc-50"}`}
                    >
                      <td className="py-3 pl-1">
                        <span className="font-black text-zinc-900 text-sm">{row.size}</span>
                      </td>
                      <td className="py-3 text-right font-semibold text-zinc-700">{fmt(row.chest, useCm)}</td>
                      <td className="py-3 text-right font-semibold text-zinc-700">{fmt(row.length, useCm)}</td>
                      <td className="py-3 pr-1 text-right font-semibold text-zinc-700">{fmt(row.shoulder, useCm)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Note */}
              <div className="mt-5 flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-amber-800 leading-relaxed">
                  All measurements in inches. For best fit, measure around the fullest part of your chest.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
