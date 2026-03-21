module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/onboarding/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OnboardingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-ssr] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-ssr] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-ssr] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/music-2.js [app-ssr] (ecmascript) <export default as Music2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-ssr] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-ssr] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/store.js [app-ssr] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
"use client";
;
;
;
;
;
;
;
// ─── Config ───────────────────────────────────────────────────────────────────
const PROGRESS_STEPS = 7;
const SUCCESS_STEP = 8;
const USER_TYPES = [
    {
        value: "artist",
        label: "Artist / Band",
        sub: "Solo or group musician",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__["Music2"]
    },
    {
        value: "label",
        label: "Label / Agency",
        sub: "Represents multiple artists",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"]
    },
    {
        value: "festival",
        label: "Festival / Event",
        sub: "Live events and tours",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"]
    },
    {
        value: "brand",
        label: "Brand / Business",
        sub: "Non-music merchandise",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"]
    }
];
const SOURCES = [
    {
        value: "instagram",
        label: "Instagram"
    },
    {
        value: "google",
        label: "Google Search"
    },
    {
        value: "friend",
        label: "A friend or colleague"
    },
    {
        value: "community",
        label: "Music community"
    },
    {
        value: "other",
        label: "Other"
    }
];
// Actual products from the Halftone Labs catalog
const PRODUCT_TYPES = [
    {
        value: "regular-tee",
        label: "Regular Tee",
        sub: "180 GSM · from ₹400",
        detail: "100% combed ring-spun cotton, regular fit"
    },
    {
        value: "oversized-tee-sj",
        label: "Oversized Tee",
        sub: "220 GSM · from ₹500",
        detail: "Single jersey, drop-shoulder oversized"
    },
    {
        value: "oversized-tee-ft",
        label: "Oversized Tee",
        sub: "240 GSM · from ₹600",
        detail: "French terry, heavyweight premium"
    },
    {
        value: "baby-tee",
        label: "Baby Tee",
        sub: "180 GSM · from ₹380",
        detail: "Cropped fitted, women's silhouette"
    },
    {
        value: "hoodie",
        label: "Hoodie",
        sub: "320 GSM · from ₹900",
        detail: "Fleece-lined, kangaroo pocket",
        lockedPlan: "Scale"
    },
    {
        value: "waffle-tee",
        label: "Waffle Tee",
        sub: "200 GSM · from ₹550",
        detail: "Waffle-knit texture, elevated basics",
        lockedPlan: "Scale"
    }
];
const BRAND_LABEL = {
    artist: "What's your artist or band name?",
    label: "What's your label or agency name?",
    festival: "What's your festival or event name?",
    brand: "What's your brand name?"
};
const BRAND_PLACEHOLDER = {
    artist: "e.g. DIVINE, When Chai Met Toast",
    label: "e.g. Universal Music India",
    festival: "e.g. Sunburn Festival",
    brand: "e.g. Rare Rabbit, The Souled Store"
};
const PRODUCT_LABEL = {
    "regular-tee": "Regular Tee",
    "oversized-tee-sj": "Oversized Tee (220 GSM)",
    "oversized-tee-ft": "Oversized Tee (240 GSM)",
    "baby-tee": "Baby Tee",
    "hoodie": "Hoodie",
    "waffle-tee": "Waffle Tee"
};
// ─── Helpers ──────────────────────────────────────────────────────────────────
const toSlug = (s)=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function OnboardingPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [userName, setUserName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [initialising, setInitialising] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [transitioning, setTransitioning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [launchError, setLaunchError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        user_type: null,
        brand_name: "",
        acquisition_source: null,
        acquisition_source_other: "",
        store_name: "",
        store_slug: "",
        first_product_type: null,
        first_drop_name: "",
        first_drop_timing: null
    });
    // ── Auth + resume ──────────────────────────────────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const init = async ()=>{
            const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
            if (!user) {
                router.replace("/login");
                return;
            }
            setUserName(user.user_metadata?.name?.split(" ")[0] || "");
            const { data: profile } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("onboarding_completed_at, onboarding_step, user_type, brand_name, acquisition_source, acquisition_source_other, store_name, store_slug, first_product_type, first_drop_name, first_drop_timing").eq("user_id", user.id).maybeSingle();
            if (profile?.onboarding_completed_at) {
                router.replace("/account");
                return;
            }
            if (profile) {
                setData((prev)=>({
                        ...prev,
                        user_type: profile.user_type || null,
                        brand_name: profile.brand_name || "",
                        acquisition_source: profile.acquisition_source || null,
                        acquisition_source_other: profile.acquisition_source_other || "",
                        store_name: profile.store_name || "",
                        store_slug: profile.store_slug || "",
                        first_product_type: profile.first_product_type || null,
                        first_drop_name: profile.first_drop_name || "",
                        first_drop_timing: profile.first_drop_timing || null
                    }));
                const savedStep = profile.onboarding_step ?? 0;
                if (savedStep > 0) setStep(savedStep);
            }
            setInitialising(false);
        };
        init();
    }, [
        router
    ]);
    // ── Save to Supabase ───────────────────────────────────────────────────────
    const saveProgress = async (nextStep, payload, complete = false)=>{
        try {
            const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
            if (!user) return;
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").upsert({
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
                ...complete ? {
                    onboarding_completed_at: new Date().toISOString()
                } : {}
            }, {
                onConflict: "user_id"
            });
        } catch (err) {
            console.error("Onboarding save failed:", err);
        }
    };
    // ── Navigation ─────────────────────────────────────────────────────────────
    const goTo = async (nextStep, payload = data)=>{
        setTransitioning(true);
        await saveProgress(nextStep, payload);
        setStep(nextStep);
        setTransitioning(false);
        window.scrollTo({
            top: 0
        });
    };
    const next = (overrides)=>{
        const payload = {
            ...data,
            ...overrides
        };
        setData(payload);
        return goTo(step + 1, payload);
    };
    const back = ()=>{
        setStep((s)=>Math.max(0, s - 1));
        window.scrollTo({
            top: 0
        });
    };
    const skip = ()=>goTo(step + 1);
    // ── Launch (Step 7 → 8) ────────────────────────────────────────────────────
    const launch = async ()=>{
        setLaunchError("");
        setTransitioning(true);
        try {
            const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
            if (!user) {
                router.replace("/login");
                return;
            }
            // Create the organisation record
            const res = await fetch("/api/organizations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: user.id,
                    name: data.store_name || data.brand_name,
                    slug: data.store_slug,
                    description: data.user_type ? `${data.brand_name} — ${data.user_type}` : data.brand_name
                })
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
            window.scrollTo({
                top: 0
            });
        } catch  {
            setLaunchError("Network error. Check your connection and try again.");
        }
        setTransitioning(false);
    };
    // ── Progress ───────────────────────────────────────────────────────────────
    const showProgress = step >= 1 && step < SUCCESS_STEP;
    const progressPct = showProgress ? (step - 1) / (PROGRESS_STEPS - 1) * 100 : 0;
    // ── Render ─────────────────────────────────────────────────────────────────
    if (initialising) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-white flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                size: 20,
                className: "text-halftone-purple animate-spin"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 325,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/onboarding/page.tsx",
            lineNumber: 324,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-white flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "h-14 shrink-0 flex items-center justify-between px-5 border-b border-black/[0.05]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "text-sm md:text-base",
                        style: {
                            fontWeight: 600,
                            letterSpacing: "-0.05em"
                        },
                        children: "Halftone Labs"
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this),
                    showProgress && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-zinc-400",
                        style: {
                            fontWeight: 500
                        },
                        children: [
                            step,
                            " / ",
                            PROGRESS_STEPS
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 339,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 334,
                columnNumber: 7
            }, this),
            showProgress && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-0.5 bg-black/[0.05] shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    className: "h-full bg-halftone-purple",
                    initial: false,
                    animate: {
                        width: `${progressPct}%`
                    },
                    transition: {
                        duration: 0.35,
                        ease: "easeInOut"
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/onboarding/page.tsx",
                    lineNumber: 348,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 347,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-full flex flex-col items-center justify-center px-5 py-10",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-[420px]",
                        children: [
                            step > 0 && step < SUCCESS_STEP && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: back,
                                disabled: transitioning,
                                className: "flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-700 transition-colors mb-8 disabled:opacity-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                        size: 15,
                                        strokeWidth: 2.5
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 369,
                                        columnNumber: 17
                                    }, this),
                                    "Back"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 364,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                mode: "wait",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        y: 14
                                    },
                                    animate: {
                                        opacity: 1,
                                        y: 0
                                    },
                                    exit: {
                                        opacity: 0,
                                        y: -14
                                    },
                                    transition: {
                                        duration: 0.22,
                                        ease: "easeOut"
                                    },
                                    children: [
                                        step === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Step0Welcome, {
                                            name: userName,
                                            onNext: ()=>goTo(1),
                                            loading: transitioning
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 383,
                                            columnNumber: 19
                                        }, this),
                                        step === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Step1UserType, {
                                            value: data.user_type,
                                            onChange: (v)=>setData({
                                                    ...data,
                                                    user_type: v
                                                }),
                                            onNext: ()=>next(),
                                            loading: transitioning
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 386,
                                            columnNumber: 19
                                        }, this),
                                        step === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Step2BrandName, {
                                            userType: data.user_type,
                                            value: data.brand_name,
                                            onChange: (v)=>setData({
                                                    ...data,
                                                    brand_name: v,
                                                    store_name: data.store_name || v,
                                                    store_slug: data.store_slug || toSlug(v)
                                                }),
                                            onNext: ()=>next(),
                                            loading: transitioning
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 394,
                                            columnNumber: 19
                                        }, this),
                                        step === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Step3Source, {
                                            value: data.acquisition_source,
                                            otherValue: data.acquisition_source_other,
                                            onChange: (v, other)=>setData({
                                                    ...data,
                                                    acquisition_source: v,
                                                    acquisition_source_other: other
                                                }),
                                            onNext: ()=>next(),
                                            onSkip: skip,
                                            loading: transitioning
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 410,
                                            columnNumber: 19
                                        }, this),
                                        step === 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Step4Store, {
                                            storeName: data.store_name,
                                            storeSlug: data.store_slug,
                                            onChangeName: (v)=>setData({
                                                    ...data,
                                                    store_name: v,
                                                    store_slug: toSlug(v)
                                                }),
                                            onChangeSlug: (v)=>setData({
                                                    ...data,
                                                    store_slug: v
                                                }),
                                            onNext: ()=>next(),
                                            loading: transitioning
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 422,
                                            columnNumber: 19
                                        }, this),
                                        step === 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Step5Product, {
                                            value: data.first_product_type,
                                            onChange: (v)=>setData({
                                                    ...data,
                                                    first_product_type: v
                                                }),
                                            onNext: ()=>next(),
                                            onSkip: skip,
                                            loading: transitioning
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 434,
                                            columnNumber: 19
                                        }, this),
                                        step === 6 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Step6Drop, {
                                            brandName: data.brand_name,
                                            dropName: data.first_drop_name,
                                            timing: data.first_drop_timing,
                                            onChangeName: (v)=>setData({
                                                    ...data,
                                                    first_drop_name: v
                                                }),
                                            onChangeTiming: (v)=>setData({
                                                    ...data,
                                                    first_drop_timing: v
                                                }),
                                            onNext: ()=>next(),
                                            onSkip: skip,
                                            loading: transitioning
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 443,
                                            columnNumber: 19
                                        }, this),
                                        step === 7 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Step7Review, {
                                            data: data,
                                            onBack: ()=>setStep(6),
                                            onLaunch: launch,
                                            loading: transitioning,
                                            error: launchError
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 455,
                                            columnNumber: 19
                                        }, this),
                                        step === SUCCESS_STEP && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Step8Success, {
                                            brandName: data.brand_name,
                                            storeSlug: data.store_slug
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 464,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, step, true, {
                                    fileName: "[project]/src/app/onboarding/page.tsx",
                                    lineNumber: 375,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 374,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 360,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/onboarding/page.tsx",
                    lineNumber: 359,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 358,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/onboarding/page.tsx",
        lineNumber: 331,
        columnNumber: 5
    }, this);
}
// ─── Step 0: Welcome ──────────────────────────────────────────────────────────
function Step0Welcome({ name, onNext, loading }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-10 h-10 rounded-xl bg-halftone-purple/10 flex items-center justify-center mb-7",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                    size: 18,
                    className: "text-halftone-purple"
                }, void 0, false, {
                    fileName: "[project]/src/app/onboarding/page.tsx",
                    lineNumber: 490,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 489,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-3xl md:text-[2.2rem] mb-3",
                style: {
                    fontWeight: 600,
                    letterSpacing: "-0.05em"
                },
                children: name ? `Welcome, ${name}.` : "Welcome."
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 492,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-zinc-500 text-[0.9rem] leading-relaxed mb-2",
                style: {
                    fontWeight: 300
                },
                children: "Let's set up your store in a few quick steps — choose your type, configure your brand, and name your first drop."
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 495,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-zinc-400 text-xs mb-6",
                style: {
                    fontWeight: 300
                },
                children: "Takes about 2 minutes."
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 498,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-zinc-400 text-xs mb-9 flex items-center gap-1.5",
                style: {
                    fontWeight: 400
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-1.5 h-1.5 rounded-full bg-green-400 inline-block shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 502,
                        columnNumber: 9
                    }, this),
                    "Start free. Upgrade when you're ready to scale."
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 501,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Btn, {
                onClick: onNext,
                loading: loading,
                children: "Get started"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 505,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/onboarding/page.tsx",
        lineNumber: 488,
        columnNumber: 5
    }, this);
}
// ─── Step 1: User Type ────────────────────────────────────────────────────────
function Step1UserType({ value, onChange, onNext, loading }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepLabel, {
                children: "Step 1"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 527,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "step-heading",
                children: "What best describes you?"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 528,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "step-sub",
                children: "This personalises your experience."
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 529,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-2.5 mb-7",
                children: USER_TYPES.map(({ value: v, label, sub, icon: Icon })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onChange(v),
                        className: `text-left p-3.5 rounded-xl border transition-colors ${value === v ? "border-halftone-purple bg-halftone-purple/[0.04]" : "border-black/[0.08] hover:border-black/[0.16]"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                size: 18,
                                className: `mb-2.5 ${value === v ? "text-halftone-purple" : "text-zinc-300"}`
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 542,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm leading-tight mb-0.5",
                                style: {
                                    fontWeight: 600
                                },
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 546,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[0.7rem] text-zinc-400 leading-snug",
                                style: {
                                    fontWeight: 300
                                },
                                children: sub
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 549,
                                columnNumber: 13
                            }, this)
                        ]
                    }, v, true, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 533,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 531,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Btn, {
                disabled: !value,
                onClick: onNext,
                loading: loading,
                children: "Continue"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 556,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/onboarding/page.tsx",
        lineNumber: 526,
        columnNumber: 5
    }, this);
}
// ─── Step 2: Brand Name ───────────────────────────────────────────────────────
function Step2BrandName({ userType, value, onChange, onNext, loading }) {
    const heading = userType ? BRAND_LABEL[userType] : "What's your brand name?";
    const placeholder = userType ? BRAND_PLACEHOLDER[userType] : "Your name or brand";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepLabel, {
                children: "Step 2"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 581,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "step-heading",
                children: heading
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 582,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "step-sub",
                children: "Appears on your store and products."
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 583,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-7",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldLabel, {
                        children: "Name"
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 586,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        placeholder: placeholder,
                        value: value,
                        onChange: (e)=>onChange(e.target.value),
                        onKeyDown: (e)=>e.key === "Enter" && value.trim() && !loading && onNext(),
                        className: "field",
                        style: {
                            fontWeight: 500
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 587,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 585,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Btn, {
                disabled: !value.trim(),
                onClick: onNext,
                loading: loading,
                children: "Continue"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 598,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/onboarding/page.tsx",
        lineNumber: 580,
        columnNumber: 5
    }, this);
}
// ─── Step 3: Source ───────────────────────────────────────────────────────────
function Step3Source({ value, otherValue, onChange, onNext, onSkip, loading }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepLabel, {
                children: "Step 3"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 622,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "step-heading",
                children: "How did you find us?"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 623,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "step-sub",
                children: "Helps us understand what's working."
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 624,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 mb-5",
                children: SOURCES.map(({ value: v, label })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onChange(v, v === "other" ? otherValue : ""),
                        className: `flex items-center justify-between px-4 py-3 rounded-xl border text-sm text-left transition-colors ${value === v ? "border-halftone-purple bg-halftone-purple/[0.04]" : "border-black/[0.08] hover:border-black/[0.16]"}`,
                        style: {
                            fontWeight: value === v ? 500 : 400
                        },
                        children: [
                            label,
                            value === v && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                size: 14,
                                className: "text-halftone-purple shrink-0",
                                strokeWidth: 2.5
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 639,
                                columnNumber: 29
                            }, this)
                        ]
                    }, v, true, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 628,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 626,
                columnNumber: 7
            }, this),
            value === "other" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    placeholder: "Tell us more...",
                    value: otherValue,
                    onChange: (e)=>onChange("other", e.target.value),
                    className: "field",
                    style: {
                        fontWeight: 400
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/onboarding/page.tsx",
                    lineNumber: 646,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 645,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Btn, {
                        disabled: !value,
                        onClick: onNext,
                        loading: loading,
                        children: "Continue"
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 658,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skip, {
                        onClick: onSkip
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 659,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 657,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/onboarding/page.tsx",
        lineNumber: 621,
        columnNumber: 5
    }, this);
}
// ─── Step 4: Store Setup ──────────────────────────────────────────────────────
function Step4Store({ storeName, storeSlug, onChangeName, onChangeSlug, onNext, loading }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepLabel, {
                children: "Step 4"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 684,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "step-heading",
                children: "Set up your store"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 685,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "step-sub",
                children: "This is where fans buy your merch."
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 686,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-4 mb-7",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldLabel, {
                                children: "Store name"
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 690,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Your store name",
                                value: storeName,
                                onChange: (e)=>onChangeName(e.target.value),
                                className: "field",
                                style: {
                                    fontWeight: 500
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 691,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 689,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldLabel, {
                                children: "Store URL"
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 702,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-stretch border border-black/[0.08] rounded-xl overflow-hidden focus-within:border-halftone-purple transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center pl-3.5 pr-2 bg-zinc-50 text-zinc-400 text-xs whitespace-nowrap border-r border-black/[0.06]",
                                        style: {
                                            fontWeight: 400
                                        },
                                        children: "halftonelabs.in/"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 704,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "your-store",
                                        value: storeSlug,
                                        onChange: (e)=>onChangeSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/--+/g, "-")),
                                        className: "flex-1 px-3 py-3 text-sm bg-white focus:outline-none min-w-0",
                                        style: {
                                            fontWeight: 500
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 710,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 703,
                                columnNumber: 11
                            }, this),
                            storeSlug && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[0.68rem] text-zinc-400 mt-1.5 truncate",
                                style: {
                                    fontWeight: 300
                                },
                                children: [
                                    "halftonelabs.in/",
                                    storeSlug
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 724,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 701,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 688,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Btn, {
                disabled: !storeName.trim() || !storeSlug.trim(),
                onClick: onNext,
                loading: loading,
                children: "Continue"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 731,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/onboarding/page.tsx",
        lineNumber: 683,
        columnNumber: 5
    }, this);
}
// ─── Step 5: First Product ────────────────────────────────────────────────────
function Step5Product({ value, onChange, onNext, onSkip, loading }) {
    const [showUpgradeHint, setShowUpgradeHint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepLabel, {
                children: "Step 5"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 757,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "step-heading",
                children: "What will you sell first?"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 758,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "step-sub",
                children: "You can add more products later."
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 759,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 mb-7",
                children: PRODUCT_TYPES.map(({ value: v, label, sub, detail, lockedPlan })=>{
                    const isLocked = !!lockedPlan;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            if (isLocked) {
                                setShowUpgradeHint(v);
                                return;
                            }
                            onChange(v);
                            setShowUpgradeHint(null);
                        },
                        className: `flex items-start gap-3 p-3.5 rounded-xl border text-left transition-colors relative ${isLocked ? "border-black/[0.06] opacity-60 cursor-default" : value === v ? "border-halftone-purple bg-halftone-purple/[0.04]" : "border-black/[0.08] hover:border-black/[0.16]"}`,
                        children: [
                            isLocked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                size: 12,
                                className: "text-zinc-300 mt-1.5 shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 781,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${value === v ? "bg-halftone-purple" : "bg-zinc-200"}`
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 783,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-baseline gap-2 flex-wrap",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm",
                                                style: {
                                                    fontWeight: 600
                                                },
                                                children: label
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 791,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-xs ${isLocked ? "text-zinc-400" : "text-halftone-purple"}`,
                                                style: {
                                                    fontWeight: 500
                                                },
                                                children: sub
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 794,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 790,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[0.72rem] text-zinc-400 mt-0.5",
                                        style: {
                                            fontWeight: 300
                                        },
                                        children: detail
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 798,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 789,
                                columnNumber: 15
                            }, this),
                            isLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-400 shrink-0 self-center",
                                children: [
                                    lockedPlan,
                                    "+"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 803,
                                columnNumber: 17
                            }, this)
                        ]
                    }, v, true, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 765,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 761,
                columnNumber: 7
            }, this),
            showUpgradeHint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-5 px-3.5 py-3 rounded-xl bg-zinc-50 border border-black/[0.06]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-zinc-500",
                    style: {
                        fontWeight: 400
                    },
                    children: "This product is available on the Scale plan. You can start with any free product now and unlock premium products after your first drop."
                }, void 0, false, {
                    fileName: "[project]/src/app/onboarding/page.tsx",
                    lineNumber: 814,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 813,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Btn, {
                        disabled: !value,
                        onClick: onNext,
                        loading: loading,
                        children: "Continue"
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 821,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skip, {
                        onClick: onSkip
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 822,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 820,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/onboarding/page.tsx",
        lineNumber: 756,
        columnNumber: 5
    }, this);
}
// ─── Step 6: First Drop ───────────────────────────────────────────────────────
function Step6Drop({ brandName, dropName, timing, onChangeName, onChangeTiming, onNext, onSkip, loading }) {
    const placeholder = brandName ? `${brandName} Drop 001` : "Drop 001";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepLabel, {
                children: "Step 6"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 853,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "step-heading",
                children: "Name your first drop"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 854,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "step-sub",
                children: "A drop is a limited-time merch release."
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 855,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-4 mb-7",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldLabel, {
                                children: "Drop name"
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 859,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: placeholder,
                                value: dropName,
                                onChange: (e)=>onChangeName(e.target.value),
                                className: "field",
                                style: {
                                    fontWeight: 500
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 860,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 858,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldLabel, {
                                children: "Launch timing"
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 871,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-2",
                                children: [
                                    "now",
                                    "later"
                                ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onChangeTiming(t),
                                        className: `py-3 rounded-xl border text-sm transition-colors ${timing === t ? "border-halftone-purple bg-halftone-purple/[0.04]" : "border-black/[0.08] hover:border-black/[0.16]"}`,
                                        style: {
                                            fontWeight: timing === t ? 500 : 400
                                        },
                                        children: t === "now" ? "Right away" : "Schedule later"
                                    }, t, false, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 874,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 872,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 870,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 857,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Btn, {
                        disabled: !dropName.trim() || !timing,
                        onClick: onNext,
                        loading: loading,
                        children: "Continue"
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 892,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skip, {
                        onClick: onSkip
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 895,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 891,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/onboarding/page.tsx",
        lineNumber: 852,
        columnNumber: 5
    }, this);
}
// ─── Step 7: Review & Launch ──────────────────────────────────────────────────
function Step7Review({ data, onBack, onLaunch, loading, error }) {
    const typeLabel = USER_TYPES.find((u)=>u.value === data.user_type)?.label || "";
    const productLabel = data.first_product_type ? PRODUCT_LABEL[data.first_product_type] : "";
    const rows = [
        {
            label: "Type",
            value: typeLabel
        },
        {
            label: "Brand",
            value: data.brand_name
        },
        {
            label: "Store URL",
            value: data.store_slug ? `halftonelabs.in/${data.store_slug}` : ""
        },
        {
            label: "Product",
            value: productLabel
        },
        {
            label: "Drop",
            value: data.first_drop_name
        }
    ].filter((r)=>r.value);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StepLabel, {
                children: "Step 7"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 929,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "step-heading",
                children: "Ready to launch?"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 930,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "step-sub",
                children: "Here's what you've set up. Everything can be changed later."
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 931,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border border-black/[0.06] rounded-2xl overflow-hidden mb-6",
                children: rows.map((row, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `flex items-start justify-between gap-3 px-4 py-3.5 ${i < rows.length - 1 ? "border-b border-black/[0.04]" : ""}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[0.65rem] font-semibold uppercase tracking-wider text-zinc-400 shrink-0 pt-0.5",
                                children: row.label
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 941,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-zinc-800 text-right break-all",
                                style: {
                                    fontWeight: 500
                                },
                                children: row.value
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 944,
                                columnNumber: 13
                            }, this)
                        ]
                    }, row.label, true, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 935,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 933,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl mb-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        size: 15,
                        className: "text-red-500 shrink-0 mt-0.5"
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 953,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-red-600",
                        style: {
                            fontWeight: 400
                        },
                        children: [
                            error,
                            error.includes("already taken") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onBack,
                                        className: "underline underline-offset-2 font-medium",
                                        children: "Edit store URL"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 959,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 954,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 952,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Btn, {
                onClick: onLaunch,
                loading: loading,
                style: {
                    background: "#9e6c9e"
                },
                children: "Launch my store"
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 968,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/onboarding/page.tsx",
        lineNumber: 928,
        columnNumber: 5
    }, this);
}
// ─── Step 8: Success ──────────────────────────────────────────────────────────
function Step8Success({ brandName, storeSlug }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-10 h-10 rounded-full bg-halftone-purple flex items-center justify-center mb-7",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                    size: 18,
                    className: "text-white",
                    strokeWidth: 2.5
                }, void 0, false, {
                    fileName: "[project]/src/app/onboarding/page.tsx",
                    lineNumber: 987,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 986,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-2xl md:text-3xl mb-3",
                style: {
                    fontWeight: 600,
                    letterSpacing: "-0.05em"
                },
                children: brandName ? `${brandName} is live.` : "Your store is live."
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 989,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-zinc-500 text-[0.9rem] leading-relaxed mb-6",
                style: {
                    fontWeight: 300
                },
                children: "Your store and organisation are created. Head to your dashboard to upload designs, configure products, and launch your first release."
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 992,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-black/[0.06] mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 997,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-zinc-500 flex-1",
                        style: {
                            fontWeight: 400
                        },
                        children: [
                            "You're on the ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold text-zinc-700",
                                children: "Free plan"
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 999,
                                columnNumber: 30
                            }, this),
                            ". Upgrade anytime to unlock more drops, premium products, and branding tools."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 998,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 996,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/account",
                        className: "flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity",
                        style: {
                            background: "#0f0f0f",
                            fontWeight: 600
                        },
                        children: [
                            "Go to dashboard",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                size: 15,
                                strokeWidth: 2.5
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 1010,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 1004,
                        columnNumber: 9
                    }, this),
                    storeSlug && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: `/store/${storeSlug}`,
                        target: "_blank",
                        rel: "noreferrer",
                        className: "flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm border border-black/[0.08] hover:border-black/[0.2] transition-colors",
                        style: {
                            fontWeight: 500
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                size: 13,
                                strokeWidth: 2
                            }, void 0, false, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 1020,
                                columnNumber: 13
                            }, this),
                            "Preview your store"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 1013,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/pricing",
                        className: "flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs text-zinc-400 hover:text-zinc-600 transition-colors",
                        style: {
                            fontWeight: 500
                        },
                        children: "View plans & pricing"
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 1024,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 1003,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/onboarding/page.tsx",
        lineNumber: 985,
        columnNumber: 5
    }, this);
}
// ─── Shared primitives ────────────────────────────────────────────────────────
function StepLabel({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-[0.6rem] font-semibold uppercase tracking-widest text-halftone-purple mb-2.5",
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/onboarding/page.tsx",
        lineNumber: 1040,
        columnNumber: 5
    }, this);
}
function FieldLabel({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "block text-[0.62rem] font-semibold uppercase tracking-widest text-zinc-400 mb-1.5",
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/onboarding/page.tsx",
        lineNumber: 1048,
        columnNumber: 5
    }, this);
}
function Btn({ onClick, disabled, loading, children, style }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        disabled: disabled || loading,
        className: "flex items-center gap-2 px-6 py-3.5 rounded-xl text-white text-sm hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity",
        style: {
            background: "#0f0f0f",
            fontWeight: 600,
            ...style
        },
        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
            size: 15,
            className: "animate-spin"
        }, void 0, false, {
            fileName: "[project]/src/app/onboarding/page.tsx",
            lineNumber: 1075,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                    size: 15,
                    strokeWidth: 2.5
                }, void 0, false, {
                    fileName: "[project]/src/app/onboarding/page.tsx",
                    lineNumber: 1079,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true)
    }, void 0, false, {
        fileName: "[project]/src/app/onboarding/page.tsx",
        lineNumber: 1068,
        columnNumber: 5
    }, this);
}
function Skip({ onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: "text-sm text-zinc-400 hover:text-zinc-600 transition-colors",
        style: {
            fontWeight: 400
        },
        children: "Skip for now"
    }, void 0, false, {
        fileName: "[project]/src/app/onboarding/page.tsx",
        lineNumber: 1088,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fd18c096._.js.map