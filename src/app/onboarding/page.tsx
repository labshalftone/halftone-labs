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
  Shirt,
  Package,
  ScrollText,
  ImageIcon,
  Store,
  ExternalLink,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type UserType = "artist" | "label" | "festival" | "brand" | null;
type AcquisitionSource =
  | "instagram"
  | "google"
  | "friend"
  | "community"
  | "other"
  | null;
type ProductType = "tshirt" | "hoodie" | "tote" | "poster" | null;
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

// ─── Constants ───────────────────────────────────────────────────────────────

const PROGRESS_STEPS = 7; // steps 1–7 show progress
const SUCCESS_STEP = 8;

const USER_TYPES: {
  value: UserType;
  label: string;
  sub: string;
  icon: React.FC<{ size?: number; className?: string }>;
}[] = [
  { value: "artist", label: "Artist / Band", sub: "Solo or group musician", icon: Music2 },
  { value: "label", label: "Label / Agency", sub: "Represents multiple artists", icon: Building2 },
  { value: "festival", label: "Festival / Event", sub: "Live events and tours", icon: CalendarDays },
  { value: "brand", label: "Brand / Business", sub: "Non-music merchandise", icon: ShoppingBag },
];

const SOURCES: { value: AcquisitionSource; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "google", label: "Google Search" },
  { value: "friend", label: "A friend or colleague" },
  { value: "community", label: "Music community" },
  { value: "other", label: "Other" },
];

const PRODUCT_TYPES: {
  value: ProductType;
  label: string;
  sub: string;
  icon: React.FC<{ size?: number; className?: string }>;
}[] = [
  { value: "tshirt", label: "T-Shirt", sub: "Starting at ₹249", icon: Shirt },
  { value: "hoodie", label: "Hoodie", sub: "Starting at ₹449", icon: Package },
  { value: "tote", label: "Tote Bag", sub: "Starting at ₹149", icon: ShoppingBag },
  { value: "poster", label: "Poster", sub: "Starting at ₹99", icon: ScrollText },
];

const brandNameLabel: Record<NonNullable<UserType>, string> = {
  artist: "What's your artist or band name?",
  label: "What's your label or agency name?",
  festival: "What's your festival or event name?",
  brand: "What's your brand name?",
};

const brandNamePlaceholder: Record<NonNullable<UserType>, string> = {
  artist: "e.g. DIVINE, When Chai Met Toast",
  label: "e.g. Universal Music India",
  festival: "e.g. Sunburn Festival",
  brand: "e.g. Rare Rabbit, The Souled Store",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// ─── Animation variants ───────────────────────────────────────────────────────

const stepVariants = {
  enter: { opacity: 0, y: 18 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -18 },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [initialising, setInitialising] = useState(true);
  const [saving, setSaving] = useState(false);

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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserName(user.user_metadata?.name?.split(" ")[0] || "");

      const { data: profile } = await supabase
        .from("user_profiles")
        .select(
          "onboarding_completed_at, onboarding_step, user_type, brand_name, acquisition_source, acquisition_source_other, store_name, store_slug, first_product_type, first_drop_name, first_drop_timing"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile?.onboarding_completed_at) {
        router.replace("/account");
        return;
      }

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

  // ── Supabase save ──────────────────────────────────────────────────────────

  const saveProgress = async (nextStep: number, overrides?: Partial<OnboardingData>) => {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const payload = { ...data, ...overrides };
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
          ...(nextStep >= SUCCESS_STEP
            ? { onboarding_completed_at: new Date().toISOString() }
            : {}),
        },
        { onConflict: "user_id" }
      );
    } catch (err) {
      console.error("Onboarding save failed:", err);
    }
    setSaving(false);
  };

  // ── Navigation helpers ─────────────────────────────────────────────────────

  const goTo = async (nextStep: number, overrides?: Partial<OnboardingData>) => {
    await saveProgress(nextStep, overrides);
    setStep(nextStep);
    window.scrollTo({ top: 0 });
  };

  const next = (overrides?: Partial<OnboardingData>) => goTo(step + 1, overrides);
  const back = () => { setStep((s) => Math.max(0, s - 1)); window.scrollTo({ top: 0 }); };
  const skip = () => goTo(step + 1);
  const finish = () => goTo(SUCCESS_STEP);

  // ── Progress ───────────────────────────────────────────────────────────────

  const showProgress = step >= 1 && step < SUCCESS_STEP;
  const progressPct = showProgress ? ((step - 1) / (PROGRESS_STEPS - 1)) * 100 : 0;

  // ── Loading state ──────────────────────────────────────────────────────────

  if (initialising) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-halftone-purple border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="h-14 flex items-center justify-between px-6 border-b border-black/[0.04] shrink-0">
        <Link
          href="/"
          className="text-base"
          style={{ fontWeight: 600, letterSpacing: "-0.05em" }}
        >
          Halftone Labs
        </Link>
        {showProgress && (
          <span className="text-xs text-halftone-muted" style={{ fontWeight: 500 }}>
            {step} / {PROGRESS_STEPS}
          </span>
        )}
      </nav>

      {/* Progress bar */}
      {showProgress && (
        <div className="h-px bg-black/[0.06] shrink-0">
          <motion.div
            className="h-full bg-halftone-purple"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-[440px]">
          {/* Back button */}
          {step > 0 && step < SUCCESS_STEP && (
            <button
              onClick={back}
              className="flex items-center gap-1.5 text-sm text-halftone-muted hover:text-zinc-800 transition-colors mb-10"
              style={{ fontWeight: 500 }}
            >
              <ChevronLeft size={15} strokeWidth={2.5} />
              Back
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              {step === 0 && (
                <Step0Welcome name={userName} onNext={() => next()} />
              )}
              {step === 1 && (
                <Step1UserType
                  value={data.user_type}
                  onChange={(v) => setData({ ...data, user_type: v })}
                  onNext={() => next()}
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
                />
              )}
              {step === 3 && (
                <Step3Source
                  value={data.acquisition_source}
                  otherValue={data.acquisition_source_other}
                  onChange={(v, other) =>
                    setData({
                      ...data,
                      acquisition_source: v,
                      acquisition_source_other: other,
                    })
                  }
                  onNext={() => next()}
                  onSkip={skip}
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
                />
              )}
              {step === 5 && (
                <Step5Product
                  value={data.first_product_type}
                  onChange={(v) => setData({ ...data, first_product_type: v })}
                  onNext={() => next()}
                  onSkip={skip}
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
                />
              )}
              {step === 7 && (
                <Step7Review data={data} onFinish={finish} saving={saving} />
              )}
              {step === SUCCESS_STEP && (
                <Step8Success brandName={data.brand_name} storeSlug={data.store_slug} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Step Components ──────────────────────────────────────────────────────────

// ── Step 0: Welcome ────────────────────────────────────────────────────────

function Step0Welcome({ name, onNext }: { name: string; onNext: () => void }) {
  return (
    <div>
      <div className="w-10 h-10 rounded-xl bg-halftone-purple/10 flex items-center justify-center mb-8">
        <Store size={20} className="text-halftone-purple" />
      </div>
      <h1
        className="text-3xl md:text-4xl mb-4"
        style={{ fontWeight: 600, letterSpacing: "-0.05em" }}
      >
        {name ? `Welcome, ${name}.` : "Welcome."}
      </h1>
      <p className="text-zinc-500 text-[0.95rem] leading-relaxed mb-3" style={{ fontWeight: 300 }}>
        Let&apos;s set up your store in a few quick steps. You&apos;ll choose your store type, configure your brand, and create your first drop.
      </p>
      <p className="text-zinc-400 text-sm mb-10" style={{ fontWeight: 300 }}>
        Takes about 3 minutes.
      </p>
      <button
        onClick={onNext}
        className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-white text-sm transition-opacity hover:opacity-90"
        style={{ background: "#0f0f0f", fontWeight: 600 }}
      >
        Get started
        <ArrowRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ── Step 1: User Type ──────────────────────────────────────────────────────

function Step1UserType({
  value,
  onChange,
  onNext,
}: {
  value: UserType;
  onChange: (v: UserType) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-halftone-purple mb-3">
        Step 1
      </p>
      <h2
        className="text-2xl md:text-3xl mb-2"
        style={{ fontWeight: 600, letterSpacing: "-0.05em" }}
      >
        What best describes you?
      </h2>
      <p className="text-zinc-500 text-sm mb-8" style={{ fontWeight: 300 }}>
        This helps us personalise your experience.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {USER_TYPES.map(({ value: v, label, sub, icon: Icon }) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`text-left p-4 rounded-2xl border transition-all ${
              value === v
                ? "border-halftone-purple bg-halftone-purple/[0.04]"
                : "border-black/[0.08] hover:border-black/20"
            }`}
          >
            <Icon
              size={20}
              className={value === v ? "text-halftone-purple mb-3" : "text-zinc-400 mb-3"}
            />
            <p
              className="text-sm mb-0.5"
              style={{ fontWeight: 600, letterSpacing: "-0.02em" }}
            >
              {label}
            </p>
            <p className="text-[0.72rem] text-zinc-400" style={{ fontWeight: 300 }}>
              {sub}
            </p>
          </button>
        ))}
      </div>

      <ContinueButton disabled={!value} onClick={onNext} />
    </div>
  );
}

// ── Step 2: Brand Name ─────────────────────────────────────────────────────

function Step2BrandName({
  userType,
  value,
  onChange,
  onNext,
}: {
  userType: UserType;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  const heading = userType ? brandNameLabel[userType] : "What's your brand name?";
  const placeholder = userType
    ? brandNamePlaceholder[userType]
    : "Your name or brand";

  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-halftone-purple mb-3">
        Step 2
      </p>
      <h2
        className="text-2xl md:text-3xl mb-2"
        style={{ fontWeight: 600, letterSpacing: "-0.05em" }}
      >
        {heading}
      </h2>
      <p className="text-zinc-500 text-sm mb-8" style={{ fontWeight: 300 }}>
        This will appear on your store and products.
      </p>

      <div className="mb-8">
        <label className="text-[0.62rem] font-semibold uppercase tracking-widest text-zinc-400 block mb-2">
          Name
        </label>
        <input
          autoFocus
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && value.trim() && onNext()}
          className="w-full px-4 py-3 rounded-xl border border-black/[0.08] text-sm bg-white focus:outline-none focus:border-halftone-purple transition-colors"
          style={{ fontWeight: 500 }}
        />
      </div>

      <ContinueButton disabled={!value.trim()} onClick={onNext} />
    </div>
  );
}

// ── Step 3: Source ─────────────────────────────────────────────────────────

function Step3Source({
  value,
  otherValue,
  onChange,
  onNext,
  onSkip,
}: {
  value: AcquisitionSource;
  otherValue: string;
  onChange: (v: AcquisitionSource, other: string) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-halftone-purple mb-3">
        Step 3
      </p>
      <h2
        className="text-2xl md:text-3xl mb-2"
        style={{ fontWeight: 600, letterSpacing: "-0.05em" }}
      >
        How did you find us?
      </h2>
      <p className="text-zinc-500 text-sm mb-8" style={{ fontWeight: 300 }}>
        Helps us understand what&apos;s working.
      </p>

      <div className="flex flex-col gap-2 mb-6">
        {SOURCES.map(({ value: v, label }) => (
          <button
            key={v}
            onClick={() => onChange(v, v === "other" ? otherValue : "")}
            className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm text-left transition-all ${
              value === v
                ? "border-halftone-purple bg-halftone-purple/[0.04]"
                : "border-black/[0.08] hover:border-black/20"
            }`}
            style={{ fontWeight: value === v ? 500 : 400 }}
          >
            {label}
            {value === v && (
              <Check size={15} className="text-halftone-purple shrink-0" strokeWidth={2.5} />
            )}
          </button>
        ))}
      </div>

      {value === "other" && (
        <div className="mb-6">
          <input
            autoFocus
            type="text"
            placeholder="Tell us more..."
            value={otherValue}
            onChange={(e) => onChange("other", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/[0.08] text-sm bg-white focus:outline-none focus:border-halftone-purple transition-colors"
            style={{ fontWeight: 400 }}
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <ContinueButton disabled={!value} onClick={onNext} />
        <SkipButton onClick={onSkip} />
      </div>
    </div>
  );
}

// ── Step 4: Store Setup ────────────────────────────────────────────────────

function Step4Store({
  storeName,
  storeSlug,
  onChangeName,
  onChangeSlug,
  onNext,
}: {
  storeName: string;
  storeSlug: string;
  onChangeName: (v: string) => void;
  onChangeSlug: (v: string) => void;
  onNext: () => void;
}) {
  const inp =
    "w-full px-4 py-3 rounded-xl border border-black/[0.08] text-sm bg-white focus:outline-none focus:border-halftone-purple transition-colors";

  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-halftone-purple mb-3">
        Step 4
      </p>
      <h2
        className="text-2xl md:text-3xl mb-2"
        style={{ fontWeight: 600, letterSpacing: "-0.05em" }}
      >
        Set up your store
      </h2>
      <p className="text-zinc-500 text-sm mb-8" style={{ fontWeight: 300 }}>
        This is where fans will buy your merch.
      </p>

      <div className="flex flex-col gap-5 mb-8">
        <div>
          <label className="text-[0.62rem] font-semibold uppercase tracking-widest text-zinc-400 block mb-2">
            Store name
          </label>
          <input
            autoFocus
            type="text"
            placeholder="Your store name"
            value={storeName}
            onChange={(e) => onChangeName(e.target.value)}
            className={inp}
            style={{ fontWeight: 500 }}
          />
        </div>

        <div>
          <label className="text-[0.62rem] font-semibold uppercase tracking-widest text-zinc-400 block mb-2">
            Store URL
          </label>
          <div className="flex items-center gap-0 border border-black/[0.08] rounded-xl overflow-hidden focus-within:border-halftone-purple transition-colors">
            <span
              className="pl-4 pr-2 py-3 text-sm text-zinc-400 shrink-0 bg-zinc-50"
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
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "")
                    .replace(/--+/g, "-")
                )
              }
              className="flex-1 pr-4 py-3 text-sm bg-white focus:outline-none"
              style={{ fontWeight: 500 }}
            />
          </div>
          {storeSlug && (
            <p className="text-[0.72rem] text-zinc-400 mt-2" style={{ fontWeight: 300 }}>
              halftonelabs.in/{storeSlug}
            </p>
          )}
        </div>
      </div>

      <ContinueButton disabled={!storeName.trim() || !storeSlug.trim()} onClick={onNext} />
    </div>
  );
}

// ── Step 5: First Product ──────────────────────────────────────────────────

function Step5Product({
  value,
  onChange,
  onNext,
  onSkip,
}: {
  value: ProductType;
  onChange: (v: ProductType) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-halftone-purple mb-3">
        Step 5
      </p>
      <h2
        className="text-2xl md:text-3xl mb-2"
        style={{ fontWeight: 600, letterSpacing: "-0.05em" }}
      >
        What will you sell first?
      </h2>
      <p className="text-zinc-500 text-sm mb-8" style={{ fontWeight: 300 }}>
        You can add more products later.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {PRODUCT_TYPES.map(({ value: v, label, sub, icon: Icon }) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`text-left p-4 rounded-2xl border transition-all ${
              value === v
                ? "border-halftone-purple bg-halftone-purple/[0.04]"
                : "border-black/[0.08] hover:border-black/20"
            }`}
          >
            <Icon
              size={20}
              className={value === v ? "text-halftone-purple mb-3" : "text-zinc-400 mb-3"}
            />
            <p className="text-sm mb-0.5" style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>
              {label}
            </p>
            <p className="text-[0.72rem] text-zinc-400" style={{ fontWeight: 300 }}>
              {sub}
            </p>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <ContinueButton disabled={!value} onClick={onNext} />
        <SkipButton onClick={onSkip} />
      </div>
    </div>
  );
}

// ── Step 6: First Drop ─────────────────────────────────────────────────────

function Step6Drop({
  brandName,
  dropName,
  timing,
  onChangeName,
  onChangeTiming,
  onNext,
  onSkip,
}: {
  brandName: string;
  dropName: string;
  timing: DropTiming;
  onChangeName: (v: string) => void;
  onChangeTiming: (v: DropTiming) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const defaultName = brandName ? `${brandName} Drop 001` : "Drop 001";

  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-halftone-purple mb-3">
        Step 6
      </p>
      <h2
        className="text-2xl md:text-3xl mb-2"
        style={{ fontWeight: 600, letterSpacing: "-0.05em" }}
      >
        Name your first drop
      </h2>
      <p className="text-zinc-500 text-sm mb-8" style={{ fontWeight: 300 }}>
        A drop is a limited-time merch release. You can always rename it.
      </p>

      <div className="flex flex-col gap-5 mb-8">
        <div>
          <label className="text-[0.62rem] font-semibold uppercase tracking-widest text-zinc-400 block mb-2">
            Drop name
          </label>
          <input
            autoFocus
            type="text"
            placeholder={defaultName}
            value={dropName}
            onChange={(e) => onChangeName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/[0.08] text-sm bg-white focus:outline-none focus:border-halftone-purple transition-colors"
            style={{ fontWeight: 500 }}
          />
        </div>

        <div>
          <label className="text-[0.62rem] font-semibold uppercase tracking-widest text-zinc-400 block mb-3">
            When to launch
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["now", "later"] as const).map((t) => (
              <button
                key={t}
                onClick={() => onChangeTiming(t)}
                className={`px-4 py-3 rounded-xl border text-sm transition-all ${
                  timing === t
                    ? "border-halftone-purple bg-halftone-purple/[0.04]"
                    : "border-black/[0.08] hover:border-black/20"
                }`}
                style={{ fontWeight: timing === t ? 500 : 400 }}
              >
                {t === "now" ? "Launch right away" : "Schedule later"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ContinueButton disabled={!dropName.trim() || !timing} onClick={onNext} />
        <SkipButton onClick={onSkip} />
      </div>
    </div>
  );
}

// ── Step 7: Review ─────────────────────────────────────────────────────────

function Step7Review({
  data,
  onFinish,
  saving,
}: {
  data: OnboardingData;
  onFinish: () => void;
  saving: boolean;
}) {
  const userTypeLabel = USER_TYPES.find((u) => u.value === data.user_type)?.label || "";
  const productLabel = PRODUCT_TYPES.find((p) => p.value === data.first_product_type)?.label || "";

  const rows: { label: string; value: string }[] = [
    { label: "Account type", value: userTypeLabel },
    { label: "Brand", value: data.brand_name },
    { label: "Store URL", value: data.store_slug ? `halftonelabs.in/${data.store_slug}` : "" },
    ...(productLabel ? [{ label: "First product", value: productLabel }] : []),
    ...(data.first_drop_name ? [{ label: "First drop", value: data.first_drop_name }] : []),
  ].filter((r) => r.value);

  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-halftone-purple mb-3">
        Step 7
      </p>
      <h2
        className="text-2xl md:text-3xl mb-2"
        style={{ fontWeight: 600, letterSpacing: "-0.05em" }}
      >
        Ready to launch?
      </h2>
      <p className="text-zinc-500 text-sm mb-8" style={{ fontWeight: 300 }}>
        Here&apos;s what you&apos;ve set up. You can change everything later.
      </p>

      <div className="border border-black/[0.06] rounded-2xl overflow-hidden mb-8">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-start justify-between gap-4 px-5 py-4 ${
              i < rows.length - 1 ? "border-b border-black/[0.04]" : ""
            }`}
          >
            <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-zinc-400">
              {row.label}
            </span>
            <span
              className="text-sm text-zinc-800 text-right"
              style={{ fontWeight: 500 }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onFinish}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: "#9e6c9e", fontWeight: 600 }}
      >
        {saving ? "Launching..." : "Launch my store"}
        {!saving && <ArrowRight size={16} strokeWidth={2.5} />}
      </button>
    </div>
  );
}

// ── Step 8: Success ────────────────────────────────────────────────────────

function Step8Success({
  brandName,
  storeSlug,
}: {
  brandName: string;
  storeSlug: string;
}) {
  return (
    <div>
      <div className="w-10 h-10 rounded-full bg-halftone-purple flex items-center justify-center mb-8">
        <Check size={20} className="text-white" strokeWidth={2.5} />
      </div>
      <h2
        className="text-2xl md:text-3xl mb-3"
        style={{ fontWeight: 600, letterSpacing: "-0.05em" }}
      >
        {brandName ? `${brandName} is live.` : "Your store is live."}
      </h2>
      <p className="text-zinc-500 text-[0.95rem] leading-relaxed mb-10" style={{ fontWeight: 300 }}>
        Your store is set up and ready for drops. Head to your dashboard to upload designs, configure products, and launch your first release.
      </p>

      <div className="flex flex-col gap-3">
        <Link
          href="/account"
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity"
          style={{ background: "#0f0f0f", fontWeight: 600 }}
        >
          Go to dashboard
          <ArrowRight size={16} strokeWidth={2.5} />
        </Link>
        {storeSlug && (
          <a
            href={`/store/${storeSlug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm border border-black/[0.08] hover:border-black/20 transition-colors"
            style={{ fontWeight: 500 }}
          >
            <ExternalLink size={14} strokeWidth={2} />
            Preview your store
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Shared UI Primitives ─────────────────────────────────────────────────────

function ContinueButton({
  onClick,
  disabled,
  label = "Continue",
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
      style={{ background: "#0f0f0f", fontWeight: 600 }}
    >
      {label}
      <ArrowRight size={16} strokeWidth={2.5} />
    </button>
  );
}

function SkipButton({ onClick }: { onClick: () => void }) {
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
