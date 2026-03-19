"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Users, CheckCircle, Clock, TrendingUp } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type OnboardingRecord = {
  user_id: string;
  customer_email: string;
  name: string | null;
  user_type: string | null;
  brand_name: string | null;
  acquisition_source: string | null;
  acquisition_source_other: string | null;
  store_name: string | null;
  store_slug: string | null;
  first_product_type: string | null;
  first_drop_name: string | null;
  first_drop_timing: string | null;
  onboarding_step: number | null;
  onboarding_completed_at: string | null;
  created_at: string;
};

const SOURCE_LABELS: Record<string, string> = {
  instagram: "Instagram",
  google: "Google Search",
  friend: "Friend / Colleague",
  community: "Music Community",
  other: "Other",
};

const TYPE_LABELS: Record<string, string> = {
  artist: "Artist / Band",
  label: "Label / Agency",
  festival: "Festival / Event",
  brand: "Brand / Business",
};

const PRODUCT_LABELS: Record<string, string> = {
  tshirt: "T-Shirt",
  hoodie: "Hoodie",
  tote: "Tote Bag",
  poster: "Poster",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.FC<{ size?: number; className?: string }>;
}) {
  return (
    <div className="border border-black/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[0.62rem] font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </span>
        <Icon size={15} className="text-zinc-300" />
      </div>
      <p className="text-2xl" style={{ fontWeight: 600, letterSpacing: "-0.04em" }}>
        {value}
      </p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminOnboardingPage() {
  const [records, setRecords] = useState<OnboardingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select(
          "user_id, customer_email, name, user_type, brand_name, acquisition_source, acquisition_source_other, store_name, store_slug, first_product_type, first_drop_name, first_drop_timing, onboarding_step, onboarding_completed_at, created_at"
        )
        .order("created_at", { ascending: false });

      if (error) setError(error.message);
      else setRecords(data || []);
      setLoading(false);
    };
    load();
  }, []);

  // ── Stats ──────────────────────────────────────────────────────────────────

  const total = records.length;
  const completed = records.filter((r) => r.onboarding_completed_at).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const sourceCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};

  records.forEach((r) => {
    if (r.acquisition_source) {
      sourceCounts[r.acquisition_source] = (sourceCounts[r.acquisition_source] || 0) + 1;
    }
    if (r.user_type) {
      typeCounts[r.user_type] = (typeCounts[r.user_type] || 0) + 1;
    }
  });

  const topSource = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0];

  // ── Filter ─────────────────────────────────────────────────────────────────

  const filtered = records.filter((r) => {
    if (filter === "completed") return !!r.onboarding_completed_at;
    if (filter === "incomplete") return !r.onboarding_completed_at;
    return true;
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="h-14 flex items-center justify-between px-6 border-b border-black/[0.04]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <ArrowLeft size={15} strokeWidth={2} />
            Admin
          </Link>
          <span className="text-zinc-200">/</span>
          <span className="text-sm" style={{ fontWeight: 600 }}>
            Onboarding
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1
          className="text-2xl mb-8"
          style={{ fontWeight: 600, letterSpacing: "-0.05em" }}
        >
          Onboarding Analytics
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Stat label="Total signups" value={total} icon={Users} />
          <Stat label="Completed" value={completed} icon={CheckCircle} />
          <Stat label="Completion rate" value={`${completionRate}%`} icon={TrendingUp} />
          <Stat
            label="Top source"
            value={topSource ? SOURCE_LABELS[topSource[0]] || topSource[0] : "—"}
            icon={Clock}
          />
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* By type */}
          <div className="border border-black/[0.06] rounded-2xl p-5">
            <h3
              className="text-sm mb-4"
              style={{ fontWeight: 600, letterSpacing: "-0.02em" }}
            >
              Account types
            </h3>
            <div className="flex flex-col gap-2">
              {Object.entries(TYPE_LABELS).map(([key, label]) => {
                const count = typeCounts[key] || 0;
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 w-28 shrink-0" style={{ fontWeight: 400 }}>
                      {label}
                    </span>
                    <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-halftone-purple rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-400 w-8 text-right" style={{ fontWeight: 500 }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By source */}
          <div className="border border-black/[0.06] rounded-2xl p-5">
            <h3
              className="text-sm mb-4"
              style={{ fontWeight: 600, letterSpacing: "-0.02em" }}
            >
              Acquisition sources
            </h3>
            <div className="flex flex-col gap-2">
              {Object.entries(SOURCE_LABELS).map(([key, label]) => {
                const count = sourceCounts[key] || 0;
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 w-32 shrink-0" style={{ fontWeight: 400 }}>
                      {label}
                    </span>
                    <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-halftone-orange rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-400 w-8 text-right" style={{ fontWeight: 500 }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-5">
          {(["all", "completed", "incomplete"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-colors capitalize ${
                filter === f
                  ? "bg-zinc-900 text-white"
                  : "border border-black/[0.08] text-zinc-500 hover:border-black/20"
              }`}
              style={{ fontWeight: 500 }}
            >
              {f}
            </button>
          ))}
          <span className="text-xs text-zinc-400 ml-auto" style={{ fontWeight: 400 }}>
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 rounded-full border-2 border-halftone-purple border-t-transparent animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <div className="border border-black/[0.06] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/[0.06] bg-zinc-50">
                    {[
                      "Email",
                      "Brand",
                      "Type",
                      "Source",
                      "Product",
                      "Drop",
                      "Step",
                      "Status",
                      "Date",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[0.62rem] font-semibold uppercase tracking-wider text-zinc-400 px-4 py-3 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-10 text-center text-zinc-400 text-sm">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r, i) => (
                      <tr
                        key={r.user_id}
                        className={`${
                          i < filtered.length - 1 ? "border-b border-black/[0.04]" : ""
                        } hover:bg-zinc-50 transition-colors`}
                      >
                        <td className="px-4 py-3 text-zinc-700 font-mono text-xs whitespace-nowrap">
                          {r.customer_email}
                        </td>
                        <td className="px-4 py-3 text-zinc-700 whitespace-nowrap" style={{ fontWeight: 500 }}>
                          {r.brand_name || <span className="text-zinc-300">—</span>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {r.user_type ? (
                            <span className="text-[0.72rem] px-2 py-0.5 bg-zinc-100 rounded-full text-zinc-600" style={{ fontWeight: 500 }}>
                              {TYPE_LABELS[r.user_type] || r.user_type}
                            </span>
                          ) : (
                            <span className="text-zinc-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-zinc-500 text-xs">
                          {r.acquisition_source
                            ? r.acquisition_source === "other" && r.acquisition_source_other
                              ? r.acquisition_source_other
                              : SOURCE_LABELS[r.acquisition_source] || r.acquisition_source
                            : <span className="text-zinc-300">—</span>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-zinc-500 text-xs">
                          {r.first_product_type
                            ? PRODUCT_LABELS[r.first_product_type] || r.first_product_type
                            : <span className="text-zinc-300">—</span>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-zinc-500 text-xs max-w-[140px] truncate">
                          {r.first_drop_name || <span className="text-zinc-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs text-zinc-400" style={{ fontWeight: 500 }}>
                            {r.onboarding_step ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {r.onboarding_completed_at ? (
                            <span className="text-[0.7rem] px-2 py-0.5 bg-green-50 text-green-700 rounded-full" style={{ fontWeight: 600 }}>
                              Done
                            </span>
                          ) : (
                            <span className="text-[0.7rem] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full" style={{ fontWeight: 600 }}>
                              {r.onboarding_step
                                ? `Step ${r.onboarding_step}`
                                : "Not started"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-zinc-400 text-xs whitespace-nowrap font-mono">
                          {new Date(r.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
