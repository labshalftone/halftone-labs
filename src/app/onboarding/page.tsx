"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowRight,
  ChevronLeft,
  Check,
  Music2,
  Building2,
  CalendarDays,
  ShoppingBag,
  Store,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserType = "artist" | "label" | "festival" | "brand" | null;
type AcquisitionSource =
  | "instagram"
  | "google"
  | "friend"
  | "community"
  | "other"
  | null;
type ProductType =
  | "regular-tee"
  | "oversized-tee-sj"
  | "oversized-tee-ft"
  | "baby-tee"
  | null;
type DropTiming = "now" | "later" | null;

interface OnboardingData {
  user_type: UserType;
  brand_name: string;
  acquisition_source: AcquisitionSource;
  acquisition_source_other: string;
  store_name: string;
  store_slug: string;
  first_product_type: ProductType;
  first_drop_name: string;
  first_drop_timing: DropTiming;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const PROGRESS_STEPS = 7;
const SUCCESS_STEP = 8;

const USER_TYPES: {
  value: UserType;
  label: string;
  sub: string;
  icon: React.FC<{ size?: number; className?: string }>;
}[] = [
  { value: "artist",   label: "Artist / Band",     sub: "Solo or group musician",    icon: Music2 },
  { value: "label",    label: "Label / Agency",     sub: "Represents multiple artists", icon: Building2 },
  { value: "festival", label: "Festival / Event",   sub: "Live events and tours",     icon: CalendarDays },
  { value: "brand",    label: "Brand / Business",   sub: "Non-music merchandise",     icon: ShoppingBag },
];

const SOURCES: { value: AcquisitionSource; label: string }[] = [
  { value: "instagram",  label: "Instagram" },
  { value: "google",     label: "Google Search" },
  { value: "friend",     label: "A friend or colleague" },
  { value: "community",  label: "Music community" },
  { value: "other",      label: "Other" },
];

// Actual products from the Halftone Labs catalog
const PRODUCT_TYPES: {
  value: ProductType;
  label: string;
  sub: string;
  detail: string;
}[] = [
  {
    value: "regular-tee",
    label: "Regular Tee",
    sub: "180 GSM · from ₹400",
    detail: "100% combed ring-spun cotton, regular fit",
  },
  {
    value: "oversized-tee-sj",
    label: "Oversized Tee",
    sub: "220 GSM · from ₹500",
    detail: "Single jersey, drop-shoulder oversized",
  },
  {
    value: "oversized-tee-ft",
    label: "Oversized Tee",
    sub: "240 GSM · from ₹600",
    detail: "French terry, heavyweight premium",
  },
  {
    value: "baby-tee",
    label: "Baby Tee",
    sub: "180 GSM · from ₹380",
    detail: "Cropped fitted, women's silhouette",
  },
];

const BRAND_LABEL: Record<NonNullable<UserType>, string> = {
  artist:   "What's your artist or band name?",
  label:    "What's your label or agency name?",
  festival: "What's your festival or event name?",
  brand:    "What's your brand name?",
};

const BRAND_PLACEHOLDER: Record<NonNullable<UserType>, string> = {
  artist:   "e.g. DIVINE, When Chai Met Toast",
  label:    "e.g. Universal Music India",
  festival: "e.g. Sunburn Festival",
  brand:    "e.g. Rare Rabbit, The Souled Store",
};

const PRODUCT_LABEL: Record<NonNullable<ProductType>, string> = {
  "regular-tee":      "Regular Tee",
  "oversized-tee-sj": "Oversized Tee (220 GSM)",
  "oversized-tee-ft": "Oversized Tee (240 GSM)",
  "baby-tee":         "Baby Tee",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toSlug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [initialising, setInitialising] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [launchError, setLaunchError] = useState("");

  const [data, setData] = useState<OnboardingData>({
    user_type: null,
    brand_name: "",
    acquisition_source: null,
    acquisition_source_other: "",
    store_name: "",
    store_slug: "",
    first_product_type: null,
    first_drop_name: "",
    first_drop_timing: null,
  });

  // ── Auth + resume ──────────────────────────────────────────────────────────

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }

      setUserName(user.user_metadata?.name?.split(" ")[0] || "");

      const { data: profile } = await supabase
        .from("user_profiles")
        .select(
          "onboarding_completed_at, onboarding_step, user_type, brand_name, acquisition_source, acquisition_source_other, store_name, store_slug, first_product_type, first_drop_name, first_drop_timing"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile?.onboarding_completed_at) { router.replace("/account"); return; }

      if (profile) {
        setData((prev) => ({
          ...prev,
          user_type: profile.user_type || null,
          brand_name: profile.brand_name || "",
          acquisition_source: profile.acquisition_source || null,
          acquisition_source_other: profile.acquisition_source_other || "",
          store_name: profile.store_name || "",
          store_slug: profile.store_slug || "",
          first_product_type: profile.first_product_type || null,
          first_drop_name: profile.first_drop_name || "",
          first_drop_timing: profile.first_drop_timing || null,
        }));
        const savedStep = profile.onboarding_step ?? 0;
        if (savedStep > 0) setStep(savedStep);
      }

      setInitialising(false);
    };
    init();
  }, [router]);

  // ── Save to Supabase ───────────────────────────────────────────────────────

  const saveProgress = async (nextStep: number, payload: OnboardingData, complete = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("user_profiles").upsert(
        {
          user_id: user.id,
          customer_email: user.email,
          brand_name: payload.brand_name,
          user_type: payload.user_type,
          acquisition_source: payload.acquisition_source,
          acquisition_source_other: payload.acquisition_source_other,
          store_name: payload.store_name,
          store_slug: payload.store_slug,
          first_product_type: payload.first_product_type,
          first_drop_name: payload.first_drop_name,
          first_drop_timing: payload.first_drop_timing,
          onboarding_step: nextStep,
          ...(complete ? { onboarding_completed_at: new Date().toISOString() } : {}),
        },
        { onConflict: "user_id" }
      );
    } catch (err) {
      console.error("Onboarding save failed:", err);
    }
  };

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goTo = async (nextStep: number, payload = data) => {
    setTransitioning(true);
    await saveProgress(nextStep, payload);
    setStep(nextStep);
    setTransitioning(false);
    window.scrollTo({ top: 0 });
  };

  const next = (overrides?: Partial<OnboardingData>) => {
    const payload = { ...data, ...overrides };
    setData(payload);
    return goTo(step + 1, payload);
  };

  const back = () => {
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0 });
  };

  const skip = () => goTo(step + 1);

  // ── Launch (Step 7 → 8) ────────────────────────────────────────────────────

  const launch = async () => {
    setLaunchError("");
    setTransitioning(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }

      // Create the organisation record
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: data.store_name || data.brand_name,
          slug: data.store_slug,
          description: data.user_type ? `${data.brand_name} — ${data.user_type}` : data.brand_name,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 409) {
          setLaunchError("That store URL is already taken. Go back and choose a different one.");
        } else {
          setLaunchError(err.error || "Something went wrong. Please try again.");
        }
        setTransitioning(false);
        return;
      }

      // Mark onboarding complete
      await saveProgress(SUCCESS_STEP, data, true);
      setStep(SUCCESS_STEP);
      window.scrollTo({ top: 0 });
    } catch {
      setLaunchError("Network error. Check your connection and try again.");
    }

    setTransitioning(false);
  };

  // ── Progress ───────────────────────────────────────────────────────────────

  const showProgress = step >= 1 && step < SUCCESS_STEP;
  const progressPct = showProgress ? ((step - 1) / (PROGRESS_STEPS - 1)) * 100 : 0;

  // ── Render ─────────────────────────────────────────────────────────────────

  if (initialising) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 size={20} className="text-halftone-purple animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Nav */}
      <nav className="h-14 shrink-0 flex items-center justify-between px-5 border-b border-black/[0.05]">
        <Link href="/" className="text-sm md:text-base" style={{ fontWeight: 600, letterSpacing: "-0.05em" }}>
          Halftone Labs
        </Link>
        {showProgress && (
          <span className="text-xs text-zinc-400" style={{ fontWeight: 500 }}>
            {step} / {PROGRESS_STEPS}
          </span>
        )}
      </nav>

      {/* Progress bar */}
      {showProgress && (
        <div className="h-0.5 bg-black/[0.05] shrink-0">
          <motion.div
            className="h-full bg-halftone-purple"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          />
        </div>
      )}

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col items-center justify-center px-5 py-10">
          <div className="w-full max-w-[420px]">

            {/* Back button */}
            {step > 0 && step < SUCCESS_STEP && (
              <button
                onClick={back}
                disabled={transitioning}
                className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-700 transition-colors mb-8 disabled:opacity-50"
              >
                <ChevronLeft size={15} strokeWidth={2.5} />
                Back
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {step === 0 && (
                  <Step0Welcome name={userName} onNext={() => goTo(1)} loading={transitioning} />
                )}
                {step === 1 && (
                  <Step1UserType
                    value={data.user_type}
                    onChange={(v) => setData({ ...data, user_type: v })}
                    onNext={() => next()}
                    loading={transitioning}
                  />
                )}
                {step === 2 && (
                  <Step2BrandName
                    userType={data.user_type}
                    value={data.brand_name}
                    onChange={(v) =>
                      setData({
                        ...data,
                        brand_name: v,
                        store_name: data.store_name || v,
                        store_slug: data.store_slug || toSlug(v),
                      })
                    }
                    onNext={() => next()}
                    loading={transitioning}
                  />
                )}
                {step === 3 && (
                  <Step3Source
                    value={data.acquisition_source}
                    otherValue={data.acquisition_source_other}
                    onChange={(v, other) =>
                      setData({ ...data, acquisition_source: v, acquisition_source_other: other })
                    }
                    onNext={() => next()}
                    onSkip={skip}
                    loading={transitioning}
                  />
                )}
                {step === 4 && (
                  <Step4Store
                    storeName={data.store_name}
                    storeSlug={data.store_slug}
                    onChangeName={(v) =>
                      setData({ ...data, store_name: v, store_slug: toSlug(v) })
                    }
                    onChangeSlug={(v) => setData({ ...data, store_slug: v })}
                    onNext={() => next()}
                    loading={transitioning}
                  />
                )}
                {step === 5 && (
                  <Step5Product
                    value={data.first_product_type}
                    onChange={(v) => setData({ ...data, first_product_type: v })}
                    onNext={() => next()}
                    onSkip={skip}
                    loading={transitioning}
                  />
                )}
                {step === 6 && (
                  <Step6Drop
                    brandName={data.brand_name}
                    dropName={data.first_drop_name}
                    timing={data.first_drop_timing}
                    onChangeName={(v) => setData({ ...data, first_drop_name: v })}
                    onChangeTiming={(v) => setData({ ...data, first_drop_timing: v })}
                    onNext={() => next()}
                    onSkip={skip}
                    loading={transitioning}
                  />
                )}
                {step === 7 && (
                  <Step7Review
                    data={data}
                    onBack={() => setStep(6)}
                    onLaunch={launch}
                    loading={transitioning}
                    error={launchError}
                  />
                )}
                {step === SUCCESS_STEP && (
                  <Step8Success brandName={data.brand_name} storeSlug={data.store_slug} />
                )}
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 0: Welcome ──────────────────────────────────────────────────────────

function Step0Welcome({
  name,
  onNext,
  loading,
}: {
  name: string;
  onNext: () => void;
  loading: boolean;
}) {
  return (
    <div>
      <div className="w-10 h-10 rounded-xl bg-halftone-purple/10 flex items-center justify-center mb-7">
        <Store size={18} className="text-halftone-purple" />
      </div>
      <h1 className="text-3xl md:text-[2.2rem] mb-3" style={{ fontWeight: 600, letterSpacing: "-0.05em" }}>
        {name ? `Welcome, ${name}.` : "Welcome."}
      </h1>
      <p className="text-zinc-500 text-[0.9rem] leading-relaxed mb-2" style={{ fontWeight: 300 }}>
        Let&apos;s set up your store in a few quick steps — choose your type, configure your brand, and name your first drop.
      </p>
      <p className="text-zinc-400 text-xs mb-9" style={{ fontWeight: 300 }}>
        Takes about 2 minutes.
      </p>
      <Btn onClick={onNext} loading={loading}>
        Get started
      </Btn>
    </div>
  );
}

// ─── Step 1: User Type ────────────────────────────────────────────────────────

function Step1UserType({
  value,
  onChange,
  onNext,
  loading,
}: {
  value: UserType;
  onChange: (v: UserType) => void;
  onNext: () => void;
  loading: boolean;
}) {
  return (
    <div>
      <StepLabel>Step 1</StepLabel>
      <h2 className="step-heading">What best describes you?</h2>
      <p className="step-sub">This personalises your experience.</p>

      <div className="grid grid-cols-2 gap-2.5 mb-7">
        {USER_TYPES.map(({ value: v, label, sub, icon: Icon }) => (
          <button
            key={v!}
            onClick={() => onChange(v)}
            className={`text-left p-3.5 rounded-xl border transition-colors ${
              value === v
                ? "border-halftone-purple bg-halftone-purple/[0.04]"
                : "border-black/[0.08] hover:border-black/[0.16]"
            }`}
          >
            <Icon
              size={18}
              className={`mb-2.5 ${value === v ? "text-halftone-purple" : "text-zinc-300"}`}
            />
            <p className="text-sm leading-tight mb-0.5" style={{ fontWeight: 600 }}>
              {label}
            </p>
            <p className="text-[0.7rem] text-zinc-400 leading-snug" style={{ fontWeight: 300 }}>
              {sub}
            </p>
          </button>
        ))}
      </div>

      <Btn disabled={!value} onClick={onNext} loading={loading}>Continue</Btn>
    </div>
  );
}

// ─── Step 2: Brand Name ───────────────────────────────────────────────────────

function Step2BrandName({
  userType,
  value,
  onChange,
  onNext,
  loading,
}: {
  userType: UserType;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  loading: boolean;
}) {
  const heading = userType ? BRAND_LABEL[userType] : "What's your brand name?";
  const placeholder = userType ? BRAND_PLACEHOLDER[userType] : "Your name or brand";

  return (
    <div>
      <StepLabel>Step 2</StepLabel>
      <h2 className="step-heading">{heading}</h2>
      <p className="step-sub">Appears on your store and products.</p>

      <div className="mb-7">
        <FieldLabel>Name</FieldLabel>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && value.trim() && !loading && onNext()}
          className="field"
          style={{ fontWeight: 500 }}
        />
      </div>

      <Btn disabled={!value.trim()} onClick={onNext} loading={loading}>Continue</Btn>
    </div>
  );
}

// ─── Step 3: Source ───────────────────────────────────────────────────────────

function Step3Source({
  value,
  otherValue,
  onChange,
  onNext,
  onSkip,
  loading,
}: {
  value: AcquisitionSource;
  otherValue: string;
  onChange: (v: AcquisitionSource, other: string) => void;
  onNext: () => void;
  onSkip: () => void;
  loading: boolean;
}) {
  return (
    <div>
      <StepLabel>Step 3</StepLabel>
      <h2 className="step-heading">How did you find us?</h2>
      <p className="step-sub">Helps us understand what&apos;s working.</p>

      <div className="flex flex-col gap-2 mb-5">
        {SOURCES.map(({ value: v, label }) => (
          <button
            key={v!}
            onClick={() => onChange(v, v === "other" ? otherValue : "")}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm text-left transition-colors ${
              value === v
                ? "border-halftone-purple bg-halftone-purple/[0.04]"
                : "border-black/[0.08] hover:border-black/[0.16]"
            }`}
            style={{ fontWeight: value === v ? 500 : 400 }}
          >
            {label}
            {value === v && <Check size={14} className="text-halftone-purple shrink-0" strokeWidth={2.5} />}
          </button>
        ))}
      </div>

      {value === "other" && (
        <div className="mb-5">
          <input
            type="text"
            placeholder="Tell us more..."
            value={otherValue}
            onChange={(e) => onChange("other", e.target.value)}
            className="field"
            style={{ fontWeight: 400 }}
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <Btn disabled={!value} onClick={onNext} loading={loading}>Continue</Btn>
        <Skip onClick={onSkip} />
      </div>
    </div>
  );
}

// ─── Step 4: Store Setup ──────────────────────────────────────────────────────

function Step4Store({
  storeName,
  storeSlug,
  onChangeName,
  onChangeSlug,
  onNext,
  loading,
}: {
  storeName: string;
  storeSlug: string;
  onChangeName: (v: string) => void;
  onChangeSlug: (v: string) => void;
  onNext: () => void;
  loading: boolean;
}) {
  return (
    <div>
      <StepLabel>Step 4</StepLabel>
      <h2 className="step-heading">Set up your store</h2>
      <p className="step-sub">This is where fans buy your merch.</p>

      <div className="flex flex-col gap-4 mb-7">
        <div>
          <FieldLabel>Store name</FieldLabel>
          <input
            type="text"
            placeholder="Your store name"
            value={storeName}
            onChange={(e) => onChangeName(e.target.value)}
            className="field"
            style={{ fontWeight: 500 }}
          />
        </div>

        <div>
          <FieldLabel>Store URL</FieldLabel>
          <div className="flex items-stretch border border-black/[0.08] rounded-xl overflow-hidden focus-within:border-halftone-purple transition-colors">
            <span
              className="flex items-center pl-3.5 pr-2 bg-zinc-50 text-zinc-400 text-xs whitespace-nowrap border-r border-black/[0.06]"
              style={{ fontWeight: 400 }}
            >
              halftonelabs.in/
            </span>
            <input
              type="text"
              placeholder="your-store"
              value={storeSlug}
              onChange={(e) =>
                onChangeSlug(
                  e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/--+/g, "-")
                )
              }
              className="flex-1 px-3 py-3 text-sm bg-white focus:outline-none min-w-0"
              style={{ fontWeight: 500 }}
            />
          </div>
          {storeSlug && (
            <p className="text-[0.68rem] text-zinc-400 mt-1.5 truncate" style={{ fontWeight: 300 }}>
              halftonelabs.in/{storeSlug}
            </p>
          )}
        </div>
      </div>

      <Btn disabled={!storeName.trim() || !storeSlug.trim()} onClick={onNext} loading={loading}>
        Continue
      </Btn>
    </div>
  );
}

// ─── Step 5: First Product ────────────────────────────────────────────────────

function Step5Product({
  value,
  onChange,
  onNext,
  onSkip,
  loading,
}: {
  value: ProductType;
  onChange: (v: ProductType) => void;
  onNext: () => void;
  onSkip: () => void;
  loading: boolean;
}) {
  return (
    <div>
      <StepLabel>Step 5</StepLabel>
      <h2 className="step-heading">What will you sell first?</h2>
      <p className="step-sub">You can add more products later.</p>

      <div className="flex flex-col gap-2 mb-7">
        {PRODUCT_TYPES.map(({ value: v, label, sub, detail }) => (
          <button
            key={v!}
            onClick={() => onChange(v)}
            className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-colors ${
              value === v
                ? "border-halftone-purple bg-halftone-purple/[0.04]"
                : "border-black/[0.08] hover:border-black/[0.16]"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                value === v ? "bg-halftone-purple" : "bg-zinc-200"
              }`}
            />
            <div className="min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm" style={{ fontWeight: 600 }}>
                  {label}
                </span>
                <span className="text-xs text-halftone-purple" style={{ fontWeight: 500 }}>
                  {sub}
                </span>
              </div>
              <p className="text-[0.72rem] text-zinc-400 mt-0.5" style={{ fontWeight: 300 }}>
                {detail}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Btn disabled={!value} onClick={onNext} loading={loading}>Continue</Btn>
        <Skip onClick={onSkip} />
      </div>
    </div>
  );
}

// ─── Step 6: First Drop ───────────────────────────────────────────────────────

function Step6Drop({
  brandName,
  dropName,
  timing,
  onChangeName,
  onChangeTiming,
  onNext,
  onSkip,
  loading,
}: {
  brandName: string;
  dropName: string;
  timing: DropTiming;
  onChangeName: (v: string) => void;
  onChangeTiming: (v: DropTiming) => void;
  onNext: () => void;
  onSkip: () => void;
  loading: boolean;
}) {
  const placeholder = brandName ? `${brandName} Drop 001` : "Drop 001";

  return (
    <div>
      <StepLabel>Step 6</StepLabel>
      <h2 className="step-heading">Name your first drop</h2>
      <p className="step-sub">A drop is a limited-time merch release.</p>

      <div className="flex flex-col gap-4 mb-7">
        <div>
          <FieldLabel>Drop name</FieldLabel>
          <input
            type="text"
            placeholder={placeholder}
            value={dropName}
            onChange={(e) => onChangeName(e.target.value)}
            className="field"
            style={{ fontWeight: 500 }}
          />
        </div>

        <div>
          <FieldLabel>Launch timing</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {(["now", "later"] as const).map((t) => (
              <button
                key={t}
                onClick={() => onChangeTiming(t)}
                className={`py-3 rounded-xl border text-sm transition-colors ${
                  timing === t
                    ? "border-halftone-purple bg-halftone-purple/[0.04]"
                    : "border-black/[0.08] hover:border-black/[0.16]"
                }`}
                style={{ fontWeight: timing === t ? 500 : 400 }}
              >
                {t === "now" ? "Right away" : "Schedule later"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Btn disabled={!dropName.trim() || !timing} onClick={onNext} loading={loading}>
          Continue
        </Btn>
        <Skip onClick={onSkip} />
      </div>
    </div>
  );
}

// ─── Step 7: Review & Launch ──────────────────────────────────────────────────

function Step7Review({
  data,
  onBack,
  onLaunch,
  loading,
  error,
}: {
  data: OnboardingData;
  onBack: () => void;
  onLaunch: () => void;
  loading: boolean;
  error: string;
}) {
  const typeLabel = USER_TYPES.find((u) => u.value === data.user_type)?.label || "";
  const productLabel = data.first_product_type ? PRODUCT_LABEL[data.first_product_type] : "";

  const rows = [
    { label: "Type",        value: typeLabel },
    { label: "Brand",       value: data.brand_name },
    { label: "Store URL",   value: data.store_slug ? `halftonelabs.in/${data.store_slug}` : "" },
    { label: "Product",     value: productLabel },
    { label: "Drop",        value: data.first_drop_name },
  ].filter((r) => r.value);

  return (
    <div>
      <StepLabel>Step 7</StepLabel>
      <h2 className="step-heading">Ready to launch?</h2>
      <p className="step-sub">Here&apos;s what you&apos;ve set up. Everything can be changed later.</p>

      <div className="border border-black/[0.06] rounded-2xl overflow-hidden mb-6">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-start justify-between gap-3 px-4 py-3.5 ${
              i < rows.length - 1 ? "border-b border-black/[0.04]" : ""
            }`}
          >
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-zinc-400 shrink-0 pt-0.5">
              {row.label}
            </span>
            <span className="text-sm text-zinc-800 text-right break-all" style={{ fontWeight: 500 }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl mb-5">
          <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600" style={{ fontWeight: 400 }}>
            {error}
            {error.includes("already taken") && (
              <>
                {" "}
                <button onClick={onBack} className="underline underline-offset-2 font-medium">
                  Edit store URL
                </button>
              </>
            )}
          </p>
        </div>
      )}

      <Btn onClick={onLaunch} loading={loading} style={{ background: "#9e6c9e" }}>
        Launch my store
      </Btn>
    </div>
  );
}

// ─── Step 8: Success ──────────────────────────────────────────────────────────

function Step8Success({
  brandName,
  storeSlug,
}: {
  brandName: string;
  storeSlug: string;
}) {
  return (
    <div>
      <div className="w-10 h-10 rounded-full bg-halftone-purple flex items-center justify-center mb-7">
        <Check size={18} className="text-white" strokeWidth={2.5} />
      </div>
      <h2 className="text-2xl md:text-3xl mb-3" style={{ fontWeight: 600, letterSpacing: "-0.05em" }}>
        {brandName ? `${brandName} is live.` : "Your store is live."}
      </h2>
      <p className="text-zinc-500 text-[0.9rem] leading-relaxed mb-8" style={{ fontWeight: 300 }}>
        Your store and organisation are created. Head to your dashboard to upload designs, configure products, and launch your first release.
      </p>

      <div className="flex flex-col gap-2.5">
        <Link
          href="/account"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity"
          style={{ background: "#0f0f0f", fontWeight: 600 }}
        >
          Go to dashboard
          <ArrowRight size={15} strokeWidth={2.5} />
        </Link>
        {storeSlug && (
          <a
            href={`/store/${storeSlug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm border border-black/[0.08] hover:border-black/[0.2] transition-colors"
            style={{ fontWeight: 500 }}
          >
            <ExternalLink size={13} strokeWidth={2} />
            Preview your store
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function StepLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-halftone-purple mb-2.5">
      {children}
    </p>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[0.62rem] font-semibold uppercase tracking-widest text-zinc-400 mb-1.5">
      {children}
    </label>
  );
}

function Btn({
  onClick,
  disabled,
  loading,
  children,
  style,
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-white text-sm hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
      style={{ background: "#0f0f0f", fontWeight: 600, ...style }}
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <>
          {children}
          <ArrowRight size={15} strokeWidth={2.5} />
        </>
      )}
    </button>
  );
}

function Skip({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
      style={{ fontWeight: 400 }}
    >
      Skip for now
    </button>
  );
}
