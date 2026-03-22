(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/cart-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "GST_RATE",
    ()=>GST_RATE,
    "NECK_LABEL_PRICE",
    ()=>NECK_LABEL_PRICE,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const GST_RATE = 0.05; // 5% on products and shipping
const NECK_LABEL_PRICE = 7; // ₹7 per piece for DTF neck label
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    items: [],
    addItem: ()=>{},
    removeItem: ()=>{},
    updateQty: ()=>{},
    clearCart: ()=>{},
    itemsSubtotal: 0,
    printSubtotal: 0,
    neckLabelSubtotal: 0,
    count: 0,
    total: 0
});
function deriveFields(item) {
    const printPrice = item.frontPrintPrice + item.backPrintPrice;
    const hasFront = !!item.frontDesignUrl;
    const hasBack = !!item.backDesignUrl;
    const side = hasFront && hasBack ? "both" : hasBack ? "back" : hasFront ? "front" : "none";
    const hasDesign = hasFront || hasBack;
    const designDataUrl = item.frontDesignUrl || item.backDesignUrl;
    const tiers = [
        item.frontPrintTier,
        item.backPrintTier
    ].filter(Boolean);
    const printTier = tiers.length > 1 ? tiers.join(" + ") : tiers[0] ?? "";
    return {
        ...item,
        printPrice,
        side,
        hasDesign,
        designDataUrl,
        printTier,
        thumbnail: item.thumbnail ?? "",
        backThumbnail: item.backThumbnail ?? "",
        mockupFront: item.mockupFront ?? ""
    };
}
function CartProvider({ children }) {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            try {
                const saved = localStorage.getItem("hl_cart");
                if (saved) setItems(JSON.parse(saved));
            } catch  {}
        }
    }["CartProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            try {
                localStorage.setItem("hl_cart", JSON.stringify(items));
            } catch  {}
        }
    }["CartProvider.useEffect"], [
        items
    ]);
    const addItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CartProvider.useCallback[addItem]": (item)=>{
            const derived = deriveFields(item);
            setItems({
                "CartProvider.useCallback[addItem]": (prev)=>[
                        ...prev,
                        {
                            ...derived,
                            cartId: `${Date.now()}-${Math.random().toString(36).slice(2)}`
                        }
                    ]
            }["CartProvider.useCallback[addItem]"]);
        }
    }["CartProvider.useCallback[addItem]"], []);
    const removeItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CartProvider.useCallback[removeItem]": (cartId)=>{
            setItems({
                "CartProvider.useCallback[removeItem]": (prev)=>prev.filter({
                        "CartProvider.useCallback[removeItem]": (i)=>i.cartId !== cartId
                    }["CartProvider.useCallback[removeItem]"])
            }["CartProvider.useCallback[removeItem]"]);
        }
    }["CartProvider.useCallback[removeItem]"], []);
    const updateQty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CartProvider.useCallback[updateQty]": (cartId, qty)=>{
            if (qty < 1) return;
            setItems({
                "CartProvider.useCallback[updateQty]": (prev)=>prev.map({
                        "CartProvider.useCallback[updateQty]": (i)=>i.cartId === cartId ? {
                                ...i,
                                qty
                            } : i
                    }["CartProvider.useCallback[updateQty]"])
            }["CartProvider.useCallback[updateQty]"]);
        }
    }["CartProvider.useCallback[updateQty]"], []);
    const clearCart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CartProvider.useCallback[clearCart]": ()=>setItems([])
    }["CartProvider.useCallback[clearCart]"], []);
    const itemsSubtotal = items.reduce((s, i)=>s + i.blankPrice * i.qty, 0);
    const printSubtotal = items.reduce((s, i)=>s + i.printPrice * i.qty, 0);
    const neckLabelSubtotal = items.reduce((s, i)=>s + (i.neckLabel ? NECK_LABEL_PRICE * i.qty : 0), 0);
    const total = itemsSubtotal + printSubtotal + neckLabelSubtotal;
    const count = items.reduce((s, i)=>s + i.qty, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: {
            items,
            addItem,
            removeItem,
            updateQty,
            clearCart,
            itemsSubtotal,
            printSubtotal,
            neckLabelSubtotal,
            count,
            total
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/cart-context.tsx",
        lineNumber: 125,
        columnNumber: 5
    }, this);
}
_s(CartProvider, "651B2A3oLRILL0Y2bLMQzbpFTwc=");
_c = CartProvider;
const useCart = ()=>{
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
};
_s1(useCart, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "CartProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/currency-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CURRENCY_META",
    ()=>CURRENCY_META,
    "CurrencyProvider",
    ()=>CurrencyProvider,
    "RATES",
    ()=>RATES,
    "fmtPrice",
    ()=>fmtPrice,
    "toForeignAmount",
    ()=>toForeignAmount,
    "useCurrency",
    ()=>useCurrency
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const CURRENCY_META = {
    INR: {
        symbol: "₹",
        label: "INR",
        flag: "🇮🇳"
    },
    USD: {
        symbol: "$",
        label: "USD",
        flag: "🌍"
    },
    EUR: {
        symbol: "€",
        label: "EUR",
        flag: "🇪🇺"
    }
};
const RATES = {
    INR: 1,
    USD: 41.5,
    EUR: 45
};
function toForeignAmount(inr, currency) {
    if (currency === "INR") return Math.round(inr);
    return Math.round(inr / RATES[currency] * 100) / 100;
}
function fmtPrice(inr, currency) {
    const { symbol } = CURRENCY_META[currency];
    if (currency === "INR") {
        return `₹${Math.round(inr).toLocaleString("en-IN")}`;
    }
    const converted = inr / RATES[currency];
    const rounded = Math.ceil(converted * 2) / 2;
    return `${symbol}${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}`;
}
function getCookieCurrency() {
    if (typeof document === "undefined") return "INR";
    const match = document.cookie.match(/(?:^|;\s*)hl_currency=([^;]+)/);
    const val = match?.[1];
    if (val === "USD" || val === "EUR" || val === "INR") return val;
    return "INR";
}
function setCookieCurrency(c) {
    document.cookie = `hl_currency=${c};path=/;max-age=${60 * 60 * 24 * 30};samesite=lax`;
}
const CurrencyContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    currency: "INR",
    setCurrency: ()=>{},
    fmt: (inr)=>`₹${Math.round(inr).toLocaleString("en-IN")}`,
    symbol: "₹",
    isIndia: true
});
function CurrencyProvider({ children }) {
    _s();
    const [currency, setCurrencyState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("INR");
    // Read geo-detected cookie on mount (after hydration)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CurrencyProvider.useEffect": ()=>{
            setCurrencyState(getCookieCurrency());
        }
    }["CurrencyProvider.useEffect"], []);
    const setCurrency = (c)=>{
        setCurrencyState(c);
        setCookieCurrency(c);
    };
    const fmt = (inr)=>fmtPrice(inr, currency);
    const symbol = CURRENCY_META[currency].symbol;
    const isIndia = currency === "INR";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CurrencyContext.Provider, {
        value: {
            currency,
            setCurrency,
            fmt,
            symbol,
            isIndia
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/currency-context.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
_s(CurrencyProvider, "OHlKDP5nG9ZYeKRA6d6WIFQIvgo=");
_c = CurrencyProvider;
const useCurrency = ()=>{
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CurrencyContext);
};
_s1(useCurrency, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "CurrencyProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const url = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const key = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, key);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/plans.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─── Single source of truth for all plan definitions ─────────────────────────
// Everything subscription-related in the product derives from this file.
// Import PLANS or the helper functions — never hardcode plan logic elsewhere.
__turbopack_context__.s([
    "PLANS",
    ()=>PLANS,
    "PLAN_ORDER",
    ()=>PLAN_ORDER,
    "UNLIMITED",
    ()=>UNLIMITED,
    "canAccess",
    ()=>canAccess,
    "getEntitlements",
    ()=>getEntitlements,
    "getLimit",
    ()=>getLimit,
    "isUpgrade",
    ()=>isUpgrade,
    "limitLabel",
    ()=>limitLabel,
    "planRank",
    ()=>planRank,
    "requiredPlanFor",
    ()=>requiredPlanFor
]);
const UNLIMITED = Infinity;
const PLANS = {
    free: {
        key: "free",
        name: "Free",
        tagline: "Your first drop",
        description: "Everything you need to start. No credit card required.",
        monthlyInr: 0,
        annualInr: 0,
        entitlements: {
            activeDrops: 1,
            designs: UNLIMITED,
            storefronts: 1,
            teamMembers: 0,
            customBranding: false,
            customDomain: false,
            removeHalftone: false,
            shopifySync: false,
            analyticsHistory: 7,
            csvExport: false,
            apiAccess: false,
            allProducts: false,
            neckLabels: false,
            premiumPackaging: false,
            prioritySupport: false,
            dedicatedManager: false,
            bulkDiscounts: false
        }
    },
    launch: {
        key: "launch",
        name: "Launch",
        tagline: "For solo creators and early brands",
        description: "Run your brand independently — custom identity, full analytics.",
        monthlyInr: 1999,
        annualInr: 1499,
        entitlements: {
            activeDrops: 5,
            designs: UNLIMITED,
            storefronts: 1,
            teamMembers: 0,
            customBranding: true,
            customDomain: true,
            removeHalftone: false,
            shopifySync: true,
            analyticsHistory: UNLIMITED,
            csvExport: true,
            apiAccess: false,
            allProducts: false,
            neckLabels: false,
            premiumPackaging: false,
            prioritySupport: false,
            dedicatedManager: false,
            bulkDiscounts: false
        }
    },
    scale: {
        key: "scale",
        name: "Scale",
        tagline: "The core plan for serious creators",
        description: "Unlimited drops, premium products, branding unlocked — built for creators who are scaling.",
        monthlyInr: 7499,
        annualInr: 5999,
        entitlements: {
            activeDrops: UNLIMITED,
            designs: UNLIMITED,
            storefronts: 3,
            teamMembers: 5,
            customBranding: true,
            customDomain: true,
            removeHalftone: false,
            shopifySync: true,
            analyticsHistory: UNLIMITED,
            csvExport: true,
            apiAccess: true,
            allProducts: true,
            neckLabels: true,
            premiumPackaging: true,
            prioritySupport: true,
            dedicatedManager: false,
            bulkDiscounts: false
        }
    },
    business: {
        key: "business",
        name: "Business",
        tagline: "For orgs, agencies, festivals, and labels",
        description: "Multiple storefronts, white-label, API access — for teams that move at scale.",
        monthlyInr: 29999,
        annualInr: 24999,
        entitlements: {
            activeDrops: UNLIMITED,
            designs: UNLIMITED,
            storefronts: UNLIMITED,
            teamMembers: UNLIMITED,
            customBranding: true,
            customDomain: true,
            removeHalftone: true,
            shopifySync: true,
            analyticsHistory: UNLIMITED,
            csvExport: true,
            apiAccess: true,
            allProducts: true,
            neckLabels: true,
            premiumPackaging: true,
            prioritySupport: true,
            dedicatedManager: true,
            bulkDiscounts: true
        }
    },
    enterprise: {
        key: "enterprise",
        name: "Enterprise",
        tagline: "For brands running serious volume",
        description: "Custom product development, hybrid inventory, omni-channel, dedicated ops team.",
        monthlyInr: 150000,
        annualInr: 0,
        entitlements: {
            activeDrops: UNLIMITED,
            designs: UNLIMITED,
            storefronts: UNLIMITED,
            teamMembers: UNLIMITED,
            customBranding: true,
            customDomain: true,
            removeHalftone: true,
            shopifySync: true,
            analyticsHistory: UNLIMITED,
            csvExport: true,
            apiAccess: true,
            allProducts: true,
            neckLabels: true,
            premiumPackaging: true,
            prioritySupport: true,
            dedicatedManager: true,
            bulkDiscounts: true
        }
    }
};
function getEntitlements(plan) {
    return PLANS[plan].entitlements;
}
function canAccess(plan, feature) {
    const val = getEntitlements(plan)[feature];
    if (typeof val === "boolean") return val;
    if (typeof val === "number") return val > 0;
    return false;
}
function getLimit(plan, feature) {
    const val = getEntitlements(plan)[feature];
    return typeof val === "number" ? val : val ? 1 : 0;
}
function requiredPlanFor(feature) {
    for (const key of [
        "free",
        "launch",
        "scale",
        "business",
        "enterprise"
    ]){
        if (canAccess(key, feature)) return key;
    }
    return "enterprise";
}
function limitLabel(plan, feature) {
    const val = getEntitlements(plan)[feature];
    if (val === UNLIMITED) return "Unlimited";
    if (typeof val === "boolean") return val ? "Included" : "Not included";
    return String(val);
}
const PLAN_ORDER = [
    "free",
    "launch",
    "scale",
    "business",
    "enterprise"
];
function planRank(plan) {
    return PLAN_ORDER.indexOf(plan);
}
function isUpgrade(from, to) {
    return planRank(to) > planRank(from);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/subscription-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SubscriptionProvider",
    ()=>SubscriptionProvider,
    "useSubscription",
    ()=>useSubscription
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/plans.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const SubscriptionContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    plan: "free",
    status: "none",
    billing: null,
    razorpaySubscriptionId: null,
    loading: true,
    entitlements: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEntitlements"])("free"),
    can: ()=>false,
    limit: ()=>0,
    refresh: async ()=>{}
});
function SubscriptionProvider({ children }) {
    _s();
    const [plan, setPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("free");
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("none");
    const [billing, setBilling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [rzpId, setRzpId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SubscriptionProvider.useCallback[load]": async ()=>{
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session?.user) {
                setPlan("free");
                setStatus("none");
                setLoading(false);
                return;
            }
            const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("subscriptions").select("plan, status, billing, razorpay_subscription_id").eq("user_id", session.user.id).in("status", [
                "active",
                "cancelled"
            ]) // include cancelled (still active until period end)
            .order("updated_at", {
                ascending: false
            }).limit(1).maybeSingle();
            if (data && data.status === "active") {
                setPlan(data.plan || "free");
                setStatus("active");
                setBilling(data.billing);
                setRzpId(data.razorpay_subscription_id);
            } else if (data && data.status === "cancelled") {
                // Cancelled but still in grace period — keep plan active
                setPlan(data.plan || "free");
                setStatus("cancelled");
                setBilling(data.billing);
                setRzpId(data.razorpay_subscription_id);
            } else {
                setPlan("free");
                setStatus("none");
            }
            setLoading(false);
        }
    }["SubscriptionProvider.useCallback[load]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SubscriptionProvider.useEffect": ()=>{
            load();
            const { data: { subscription: authSub } } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange({
                "SubscriptionProvider.useEffect": ()=>{
                    setLoading(true);
                    load();
                }
            }["SubscriptionProvider.useEffect"]);
            return ({
                "SubscriptionProvider.useEffect": ()=>authSub.unsubscribe()
            })["SubscriptionProvider.useEffect"];
        }
    }["SubscriptionProvider.useEffect"], [
        load
    ]);
    const entitlements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEntitlements"])(plan);
    const can = (feature)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canAccess"])(plan, feature);
    const limit = (feature)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plans$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLimit"])(plan, feature);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SubscriptionContext.Provider, {
        value: {
            plan,
            status,
            billing,
            razorpaySubscriptionId: rzpId,
            loading,
            entitlements,
            can,
            limit,
            refresh: load
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/subscription-context.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
_s(SubscriptionProvider, "4t7lhdXldhJdbb6L1AF4hpcXcf0=");
_c = SubscriptionProvider;
const useSubscription = ()=>{
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(SubscriptionContext);
};
_s1(useSubscription, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "SubscriptionProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_lib_9b0314d9._.js.map