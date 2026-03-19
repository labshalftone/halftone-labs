module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/cart-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const GST_RATE = 0.05; // 5% on products and shipping
const NECK_LABEL_PRICE = 7; // ₹7 per piece for DTF neck label
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])({
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
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const saved = localStorage.getItem("hl_cart");
            if (saved) setItems(JSON.parse(saved));
        } catch  {}
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            localStorage.setItem("hl_cart", JSON.stringify(items));
        } catch  {}
    }, [
        items
    ]);
    const addItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((item)=>{
        const derived = deriveFields(item);
        setItems((prev)=>[
                ...prev,
                {
                    ...derived,
                    cartId: `${Date.now()}-${Math.random().toString(36).slice(2)}`
                }
            ]);
    }, []);
    const removeItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((cartId)=>{
        setItems((prev)=>prev.filter((i)=>i.cartId !== cartId));
    }, []);
    const updateQty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((cartId, qty)=>{
        if (qty < 1) return;
        setItems((prev)=>prev.map((i)=>i.cartId === cartId ? {
                    ...i,
                    qty
                } : i));
    }, []);
    const clearCart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setItems([]), []);
    const itemsSubtotal = items.reduce((s, i)=>s + i.blankPrice * i.qty, 0);
    const printSubtotal = items.reduce((s, i)=>s + i.printPrice * i.qty, 0);
    const neckLabelSubtotal = items.reduce((s, i)=>s + (i.neckLabel ? NECK_LABEL_PRICE * i.qty : 0), 0);
    const total = itemsSubtotal + printSubtotal + neckLabelSubtotal;
    const count = items.reduce((s, i)=>s + i.qty, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
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
const useCart = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
}),
"[project]/src/lib/currency-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
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
        flag: "🇺🇸"
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
    // Round to nearest 0.5 for clean display
    const rounded = Math.ceil(converted * 2) / 2;
    return `${symbol}${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}`;
}
const CurrencyContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])({
    currency: "INR",
    setCurrency: ()=>{},
    fmt: (inr)=>`₹${Math.round(inr).toLocaleString("en-IN")}`,
    symbol: "₹"
});
function CurrencyProvider({ children }) {
    const [currency, setCurrency] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("INR");
    const fmt = (inr)=>fmtPrice(inr, currency);
    const symbol = CURRENCY_META[currency].symbol;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CurrencyContext.Provider, {
        value: {
            currency,
            setCurrency,
            fmt,
            symbol
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/currency-context.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
const useCurrency = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(CurrencyContext);
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__698be095._.js.map