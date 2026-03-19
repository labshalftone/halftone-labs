"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultTab?: ProductKey;
  showBranding?: boolean;
};

export type ProductKey = "regular" | "oversized-sj" | "oversized-ft" | "baby";

interface Column { key: string; label: string; }
interface SizeEntry { [key: string]: string | number; }
interface ProductData {
  columns: Column[];
  rows: SizeEntry[];
  note: string;
}

const TABS: { key: ProductKey; label: string }[] = [
  { key: "regular",      label: "Regular Tee" },
  { key: "oversized-sj", label: "Oversized (220 GSM)" },
  { key: "oversized-ft", label: "Oversized (French Terry)" },
  { key: "baby",         label: "Baby Tee" },
];

const DATA: Record<ProductKey, ProductData> = {
  regular: {
    columns: [
      { key: "size",   label: "Size" },
      { key: "chest",  label: "Chest" },
      { key: "length", label: "Length" },
    ],
    rows: [
      { size: "S",   chest: 38, length: 26 },
      { size: "M",   chest: 40, length: 27 },
      { size: "L",   chest: 42, length: 28 },
      { size: "XL",  chest: 44, length: 29 },
      { size: "2XL", chest: 46, length: 30 },
    ],
    note: "The final size may vary by +/- 0.5 inches.",
  },
  "oversized-sj": {
    columns: [
      { key: "size",   label: "Size" },
      { key: "chest",  label: "Chest" },
      { key: "length", label: "Length" },
    ],
    rows: [
      { size: "S",   chest: 40, length: 27 },
      { size: "M",   chest: 42, length: 28 },
      { size: "L",   chest: 44, length: 29 },
      { size: "XL",  chest: 46, length: 30 },
      { size: "2XL", chest: 48, length: 30.5 },
    ],
    note: "The final size may vary by +/- 0.5 inches.",
  },
  "oversized-ft": {
    columns: [
      { key: "size",     label: "Size" },
      { key: "chest",    label: "Chest" },
      { key: "length",   label: "Length" },
      { key: "shoulder", label: "Shoulder" },
      { key: "sleeve",   label: "Sleeve" },
    ],
    rows: [
      { size: "XS",  chest: 40, length: 27,   shoulder: 19, sleeve: 8.7  },
      { size: "S",   chest: 42, length: 27.5, shoulder: 20, sleeve: 9.25 },
      { size: "M",   chest: 44, length: 28,   shoulder: 21, sleeve: 9.75 },
      { size: "L",   chest: 46, length: 28.5, shoulder: 22, sleeve: 10.25 },
      { size: "XL",  chest: 48, length: 29,   shoulder: 23, sleeve: 11   },
      { size: "2XL", chest: 50, length: 29.5, shoulder: 24, sleeve: 11.25 },
    ],
    note: "The final size may vary by +/- 1 inch.",
  },
  baby: {
    columns: [
      { key: "size",   label: "Size" },
      { key: "bust",   label: "Bust" },
      { key: "length", label: "Length" },
      { key: "waist",  label: "Waist" },
    ],
    rows: [
      { size: "XS",  bust: 26, length: 18, waist: 26 },
      { size: "S",   bust: 29, length: 19, waist: 28 },
      { size: "M",   bust: 31, length: 19, waist: 30 },
      { size: "L",   bust: 33, length: 20, waist: 32 },
      { size: "XL",  bust: 35, length: 20, waist: 34 },
      { size: "2XL", bust: 36, length: 20, waist: 36 },
    ],
    note: "The final size may vary by +/- 0.5 inches.",
  },
};

const IN_TO_CM = 2.54;

function fmtVal(val: string | number, cm: boolean) {
  if (typeof val === "string") return val;
  return cm ? (val * IN_TO_CM).toFixed(1) : String(val);
}

export default function SizeGuide({ open, onClose, defaultTab = "regular", showBranding = true }: Props) {
  const [activeTab, setActiveTab] = useState<ProductKey>(defaultTab);
  const [useCm, setUseCm] = useState(false);

  const { columns, rows, note } = DATA[activeTab];
  const unit = useCm ? "cm" : "in";

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
            <div className="bg-ds-dark text-white px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div>
                {showBranding && (
                  <p className="text-[0.6rem] font-mono uppercase tracking-widest text-ds-muted mb-0.5">Halftone Labs</p>
                )}
                <h2 className="text-lg font-semibold" style={{ letterSpacing: "-0.03em" }}>Size Guide</h2>
              </div>
              <div className="flex items-center gap-3">
                {/* CM / Inches toggle */}
                <button
                  onClick={() => setUseCm((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-ds-dark2 transition-colors text-xs font-bold"
                >
                  <span className={useCm ? "text-ds-muted" : "text-white"}>IN</span>
                  <span className="text-ds-body">/</span>
                  <span className={useCm ? "text-white" : "text-ds-muted"}>CM</span>
                </button>
                {/* Close */}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-ds-dark2 transition-colors text-ds-muted hover:text-white"
                  aria-label="Close size guide"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-3 bg-ds-light-gray border-b border-black/[0.06] flex-shrink-0 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                    activeTab === tab.key
                      ? "bg-ds-dark text-white shadow-sm"
                      : "text-ds-body hover:text-ds-dark hover:bg-black/[0.05]"
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
                  <tr className="border-b border-black/[0.06]">
                    {columns.map((col, i) => (
                      <th
                        key={col.key}
                        className={`pb-3 text-xs font-semibold uppercase tracking-widest text-ds-muted ${i === 0 ? "text-left" : "text-right"}`}
                      >
                        {col.label}{i > 0 ? ` (${unit})` : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={String(row.size)}
                      className={`border-b border-black/[0.06] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-ds-light-gray"}`}
                    >
                      {columns.map((col, ci) => (
                        <td
                          key={col.key}
                          className={`py-3 ${ci === 0 ? "pl-1" : "text-right"} ${ci === columns.length - 1 ? "pr-1" : ""}`}
                        >
                          {ci === 0 ? (
                            <span className="font-semibold text-ds-dark text-sm">{row[col.key]}</span>
                          ) : (
                            <span className="font-semibold text-ds-body">{fmtVal(row[col.key], useCm)}</span>
                          )}
                        </td>
                      ))}
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
                  All measurements in inches. {note}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
