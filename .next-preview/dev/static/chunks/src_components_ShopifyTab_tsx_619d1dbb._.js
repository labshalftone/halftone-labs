(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ShopifyTab.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShopifyTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shopify$2d$skus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/shopify-skus.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/products.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function initDraft(order) {
    const a = order.shipping_address;
    return {
        name: a?.name ?? "",
        address1: a?.address1 ?? "",
        address2: a?.address2 ?? "",
        city: a?.city ?? "",
        province: a?.province ?? "",
        zip: a?.zip ?? "",
        country: a?.country ?? "IN",
        phone: a?.phone ?? "",
        note: order.note ?? ""
    };
}
// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    if (!status) return null;
    const map = {
        confirmed: {
            bg: "bg-green-50 border-green-200",
            text: "text-green-700"
        },
        in_production: {
            bg: "bg-orange-50 border-orange-200",
            text: "text-orange-700"
        },
        fulfilled: {
            bg: "bg-blue-50 border-blue-200",
            text: "text-blue-700"
        },
        cancelled: {
            bg: "bg-red-50 border-red-200",
            text: "text-red-600"
        }
    };
    const s = map[status] ?? {
        bg: "bg-ds-light-gray border-black/[0.06]",
        text: "text-ds-body"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${s.bg} ${s.text}`,
        children: status.replace(/_/g, " ")
    }, void 0, false, {
        fileName: "[project]/src/components/ShopifyTab.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
_c = StatusBadge;
// ── Address display ────────────────────────────────────────────────────────────
function AddressDisplay({ address, note, isEdited }) {
    if (!address) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-xs text-ds-muted",
        children: "No shipping address"
    }, void 0, false, {
        fileName: "[project]/src/components/ShopifyTab.tsx",
        lineNumber: 95,
        columnNumber: 24
    }, this);
    const a = address;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `text-xs space-y-0.5 ${isEdited ? "text-brand" : "text-ds-body"}`,
        children: [
            isEdited && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[10px] font-bold text-brand mb-1",
                children: "✏ Edited — will be used at confirmation"
            }, void 0, false, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 99,
                columnNumber: 20
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-semibold",
                children: a.name
            }, void 0, false, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    a.address1,
                    a.address2 ? `, ${a.address2}` : ""
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    a.city,
                    a.province ? `, ${a.province}` : "",
                    " ",
                    a.zip
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: a.country_name ?? a.country
            }, void 0, false, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this),
            a.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-ds-muted",
                children: a.phone
            }, void 0, false, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 104,
                columnNumber: 19
            }, this),
            note && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-ds-muted mt-1 italic",
                children: [
                    "“",
                    note,
                    "”"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 105,
                columnNumber: 16
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ShopifyTab.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
_c1 = AddressDisplay;
// ── Address edit form ─────────────────────────────────────────────────────────
function AddressEditForm({ draft, onChange, onClose }) {
    _s();
    const [local, setLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(draft);
    const set = (k, v)=>setLocal((p)=>({
                ...p,
                [k]: v
            }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs font-bold text-ds-dark uppercase tracking-widest",
                children: "Edit order details"
            }, void 0, false, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block",
                                children: "Name"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 122,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: local.name,
                                onChange: (e)=>set("name", e.target.value),
                                className: "w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-400"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block",
                                children: "Phone"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: local.phone,
                                onChange: (e)=>set("phone", e.target.value),
                                className: "w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-400"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sm:col-span-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block",
                                children: "Address line 1"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: local.address1,
                                onChange: (e)=>set("address1", e.target.value),
                                className: "w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-400"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sm:col-span-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block",
                                children: "Address line 2"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 137,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: local.address2,
                                onChange: (e)=>set("address2", e.target.value),
                                placeholder: "Apartment, floor, etc.",
                                className: "w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-400"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block",
                                children: "City"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 143,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: local.city,
                                onChange: (e)=>set("city", e.target.value),
                                className: "w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-400"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block",
                                children: "State"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 148,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: local.province,
                                onChange: (e)=>set("province", e.target.value),
                                className: "w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-400"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block",
                                children: "PIN / ZIP"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: local.zip,
                                onChange: (e)=>set("zip", e.target.value),
                                className: "w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-400"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block",
                                children: "Country code"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: local.country,
                                onChange: (e)=>set("country", e.target.value.toUpperCase()),
                                maxLength: 2,
                                className: "w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs font-mono outline-none focus:border-zinc-400"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "text-[10px] font-semibold text-ds-muted uppercase tracking-wider mb-0.5 block",
                        children: "Production note"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: local.note,
                        onChange: (e)=>set("note", e.target.value),
                        rows: 2,
                        placeholder: "Special instructions for production…",
                        className: "w-full px-2.5 py-1.5 rounded-lg border border-black/[0.06] text-xs outline-none focus:border-zinc-400 resize-none"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            onChange(local);
                            onClose();
                        },
                        className: "flex-1 py-2 rounded-lg bg-ds-dark text-white text-xs font-bold hover:bg-ds-dark2 transition-colors",
                        children: "Save edits"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "px-4 py-2 rounded-lg border border-black/[0.06] text-xs text-ds-body hover:bg-black/[0.03] transition-colors",
                        children: "Cancel"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ShopifyTab.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
_s(AddressEditForm, "N3yqZssTcEA/n5H95514QXYKx/s=");
_c2 = AddressEditForm;
// ── Connect form ──────────────────────────────────────────────────────────────
function ConnectForm({ userId }) {
    _s1();
    const [domain, setDomain] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleConnect = ()=>{
        const raw = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
        if (!raw) return;
        const shop = raw.includes(".") ? raw : `${raw}.myshopify.com`;
        if (!/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/.test(shop)) {
            setError("Enter a valid Shopify domain, e.g. your-store.myshopify.com");
            return;
        }
        setLoading(true);
        window.location.href = `/api/shopify/auth?shop=${encodeURIComponent(shop)}&userId=${encodeURIComponent(userId)}`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-md",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-12 h-12 bg-[rgba(150,191,72,0.1)] rounded-2xl flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-6 h-6 text-[#96bf48]",
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M15.337 23.979l6.163-1.098c0 0-2.236-15.076-2.256-15.21a.345.345 0 00-.34-.29c-.013 0-.243.005-.243.005s-1.404-1.37-1.92-1.874c.004-.046.008-.093.008-.14V5.37c0-2.96-2.408-5.37-5.371-5.37-2.963 0-5.37 2.41-5.37 5.37v.002c-.516.504-1.92 1.874-1.92 1.874s-.23-.005-.244-.005a.344.344 0 00-.339.29C3.483 7.905 1.5 22.881 1.5 22.881l13.837 1.098zM12.378 1.744a3.627 3.627 0 013.624 3.624v.004l-7.247.004a3.625 3.625 0 013.623-3.632z"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 209,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ShopifyTab.tsx",
                            lineNumber: 208,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 207,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold text-ds-dark text-lg",
                                style: {
                                    letterSpacing: "-0.03em"
                                },
                                children: "Connect your Shopify store"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 213,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-ds-muted",
                                children: "Orders sync automatically. No API keys needed."
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 214,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 212,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 206,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-3 mb-8",
                children: [
                    {
                        n: "1",
                        text: "Enter your Shopify store URL below"
                    },
                    {
                        n: "2",
                        text: "You'll be redirected to Shopify to approve access"
                    },
                    {
                        n: "3",
                        text: "Click Install. You're done. Orders appear instantly."
                    }
                ].map((step)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-6 h-6 rounded-full bg-ds-dark text-white text-xs font-semibold flex items-center justify-center flex-shrink-0",
                                children: step.n
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 224,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-ds-body",
                                children: step.text
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 225,
                                columnNumber: 13
                            }, this)
                        ]
                    }, step.n, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 223,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 217,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: domain,
                        onChange: (e)=>{
                            setDomain(e.target.value);
                            setError("");
                        },
                        onKeyDown: (e)=>e.key === "Enter" && handleConnect(),
                        placeholder: "your-store.myshopify.com",
                        className: "flex-1 border border-black/[0.06] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 230,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleConnect,
                        disabled: loading || !domain.trim(),
                        className: "px-5 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-40 transition-colors whitespace-nowrap flex items-center gap-2",
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-4 h-4 animate-spin",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            strokeWidth: 2,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 237,
                                columnNumber: 121
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ShopifyTab.tsx",
                            lineNumber: 237,
                            columnNumber: 13
                        }, this) : "Connect →"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 229,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-red-500 mt-2",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 241,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ShopifyTab.tsx",
        lineNumber: 205,
        columnNumber: 5
    }, this);
}
_s1(ConnectForm, "UPncLDTVI+vjpRc7r9GCK7wGz6g=");
_c3 = ConnectForm;
// ── SKU Mapper ─────────────────────────────────────────────────────────────────
function SkuMapper({ userId }) {
    _s2();
    const [mappings, setMappings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [shopifySku, setShopifySku] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedHlSku, setSelectedHlSku] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const fetchMappings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SkuMapper.useCallback[fetchMappings]": async ()=>{
            setLoading(true);
            const res = await fetch(`/api/shopify/sku-mappings?userId=${userId}`);
            const data = await res.json();
            setMappings(Array.isArray(data) ? data : []);
            setLoading(false);
        }
    }["SkuMapper.useCallback[fetchMappings]"], [
        userId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SkuMapper.useEffect": ()=>{
            fetchMappings();
        }
    }["SkuMapper.useEffect"], [
        fetchMappings
    ]);
    const handleAdd = async ()=>{
        if (!shopifySku.trim() || !selectedHlSku) return;
        const hlEntry = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shopify$2d$skus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SKU_CATALOG"].find((s)=>s.sku === selectedHlSku);
        if (!hlEntry) return;
        setSaving(true);
        setError("");
        const res = await fetch("/api/shopify/sku-mappings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId,
                shopifySku: shopifySku.trim(),
                hlProductId: hlEntry.productId,
                hlProductName: hlEntry.productName,
                hlColorName: hlEntry.colorName,
                hlColorHex: hlEntry.colorHex,
                hlSize: hlEntry.size,
                hlGsm: hlEntry.gsm,
                hlBlankPrice: hlEntry.blankPrice
            })
        });
        const data = await res.json();
        setSaving(false);
        if (!res.ok) {
            setError(data.error ?? "Failed to save");
            return;
        }
        setShopifySku("");
        setSelectedHlSku("");
        fetchMappings();
    };
    const handleDelete = async (id)=>{
        await fetch(`/api/shopify/sku-mappings?id=${id}`, {
            method: "DELETE"
        });
        fetchMappings();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-ds-dark text-base mb-1",
                        style: {
                            letterSpacing: "-0.02em"
                        },
                        children: "SKU Mapping"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 295,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-ds-body",
                        children: [
                            "Map your Shopify product variant SKUs to Halftone Labs products. Or set your Shopify variant SKUs to our format directly (e.g. ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                className: "bg-black/[0.05] px-1.5 py-0.5 rounded text-xs font-mono",
                                children: "HL-RT-WHT-M"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 297,
                                columnNumber: 138
                            }, this),
                            ")."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 294,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                className: "mb-6 bg-ds-light-gray border border-black/[0.06] rounded-xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                        className: "px-4 py-3 text-sm font-semibold text-ds-body cursor-pointer select-none",
                        children: [
                            "View full SKU catalog (",
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shopify$2d$skus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SKU_CATALOG"].length,
                            " variants)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 301,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 pb-4 overflow-x-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full text-xs mt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "text-ds-muted uppercase tracking-widest text-[10px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "text-left py-1.5 pr-4",
                                                children: "SKU"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                lineNumber: 308,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "text-left py-1.5 pr-4",
                                                children: "Product"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                lineNumber: 309,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "text-left py-1.5 pr-4",
                                                children: "Color"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                lineNumber: 310,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "text-left py-1.5",
                                                children: "Size"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                lineNumber: 311,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                        lineNumber: 307,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                    lineNumber: 306,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    className: "divide-y divide-zinc-100",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shopify$2d$skus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SKU_CATALOG"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "font-mono",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-1 pr-4 text-brand-dark font-semibold",
                                                    children: s.sku
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-1 pr-4 font-sans text-ds-body",
                                                    children: [
                                                        s.productName,
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-ds-muted",
                                                            children: [
                                                                "(",
                                                                s.gsm,
                                                                ")"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ShopifyTab.tsx",
                                                            lineNumber: 318,
                                                            columnNumber: 84
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                                    lineNumber: 318,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-1 pr-4 font-sans flex items-center gap-1.5 mt-0.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "w-3 h-3 rounded-full border border-black/[0.06] flex-shrink-0",
                                                            style: {
                                                                background: s.colorHex
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ShopifyTab.tsx",
                                                            lineNumber: 320,
                                                            columnNumber: 21
                                                        }, this),
                                                        s.colorName
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                                    lineNumber: 319,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-1 font-sans text-ds-body",
                                                    children: s.size
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                                    lineNumber: 323,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, s.sku, true, {
                                            fileName: "[project]/src/components/ShopifyTab.tsx",
                                            lineNumber: 316,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                    lineNumber: 314,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ShopifyTab.tsx",
                            lineNumber: 305,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 304,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 300,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border border-black/[0.06] rounded-xl p-4 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-semibold text-ds-muted uppercase tracking-widest mb-3",
                        children: "Add Mapping"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 331,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: shopifySku,
                                onChange: (e)=>setShopifySku(e.target.value),
                                placeholder: "Your Shopify SKU (e.g. MY-TEE-BLK-M)",
                                className: "flex-1 border border-black/[0.06] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 333,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: selectedHlSku,
                                onChange: (e)=>setSelectedHlSku(e.target.value),
                                className: "flex-1 border border-black/[0.06] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Select HL product variant…"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                        lineNumber: 338,
                                        columnNumber: 13
                                    }, this),
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"].map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("optgroup", {
                                            label: `${product.name} (${product.gsm})`,
                                            children: product.colors.flatMap((color)=>product.sizes.map((size)=>{
                                                    const entry = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shopify$2d$skus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SKU_CATALOG"].find((s)=>s.productId === product.id && s.colorName === color.name && s.size === size);
                                                    if (!entry) return null;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: entry.sku,
                                                        children: [
                                                            entry.sku,
                                                            " — ",
                                                            color.name,
                                                            " / ",
                                                            size
                                                        ]
                                                    }, entry.sku, true, {
                                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                                        lineNumber: 345,
                                                        columnNumber: 28
                                                    }, this);
                                                }).filter(Boolean))
                                        }, product.id, false, {
                                            fileName: "[project]/src/components/ShopifyTab.tsx",
                                            lineNumber: 340,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 336,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleAdd,
                                disabled: saving || !shopifySku.trim() || !selectedHlSku,
                                className: "px-5 py-2.5 rounded-xl bg-ds-dark text-white text-sm font-bold hover:bg-ds-dark2 disabled:opacity-40 transition-colors whitespace-nowrap",
                                children: saving ? "Saving…" : "Add"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 351,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 332,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-red-500 mt-2",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 356,
                        columnNumber: 19
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 330,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-ds-muted",
                children: "Loading mappings…"
            }, void 0, false, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 359,
                columnNumber: 9
            }, this) : mappings.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-ds-muted",
                children: "No custom mappings yet."
            }, void 0, false, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 361,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2",
                children: mappings.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3 bg-white border border-black/[0.06] rounded-xl px-4 py-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-mono text-xs text-ds-body font-semibold",
                                        children: m.shopify_sku
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                        lineNumber: 367,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4 text-ds-muted flex-shrink-0",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        strokeWidth: 2,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            d: "M14 5l7 7m0 0l-7 7m7-7H3"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ShopifyTab.tsx",
                                            lineNumber: 369,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                        lineNumber: 368,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-3 h-3 rounded-full flex-shrink-0 border border-black/[0.06]",
                                                style: {
                                                    background: m.hl_color_hex
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                lineNumber: 372,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-ds-body font-semibold truncate",
                                                children: [
                                                    m.hl_product_name,
                                                    " / ",
                                                    m.hl_color_name,
                                                    " / ",
                                                    m.hl_size
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                lineNumber: 373,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                        lineNumber: 371,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 366,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleDelete(m.id),
                                className: "text-ds-muted hover:text-red-400 transition-colors flex-shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-4 h-4",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    strokeWidth: 2,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                        lineNumber: 378,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                    lineNumber: 377,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 376,
                                columnNumber: 15
                            }, this)
                        ]
                    }, m.id, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 365,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 363,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ShopifyTab.tsx",
        lineNumber: 293,
        columnNumber: 5
    }, this);
}
_s2(SkuMapper, "s2xwU7/EwcxC0BEG26hqzrnyuQk=");
_c4 = SkuMapper;
// ── Orders list (bulk-confirmation focused) ───────────────────────────────────
function OrdersList({ userId, shopDomain }) {
    _s3();
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("pending");
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editDrafts, setEditDrafts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [confirming, setConfirming] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [confirmErrors, setConfirmErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [bulkConfirming, setBulkConfirming] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [bulkProgress, setBulkProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        done: 0,
        total: 0
    });
    const [walletBalance, setWalletBalance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [walletCurrency, setWalletCurrency] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("INR");
    const [inrToWalletRate, setInrToWalletRate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [shippingRates, setShippingRates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [shippingLoading, setShippingLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [selectedShipping, setSelectedShipping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const SYMBOLS = {
        INR: "₹",
        USD: "$",
        EUR: "€",
        GBP: "£",
        AED: "د.إ",
        SGD: "S$",
        AUD: "A$",
        CAD: "C$"
    };
    const fmtWallet = (inr)=>{
        if (walletCurrency === "INR") return `₹${Math.round(inr).toLocaleString("en-IN")}`;
        const c = Math.round(inr * inrToWalletRate * 100) / 100;
        return `${SYMBOLS[walletCurrency] ?? walletCurrency}${c.toFixed(2)}`;
    };
    const isDomestic = (o)=>o.shipping_address?.country === "IN" || o.shipping_address?.country === "India";
    const fetchOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OrdersList.useCallback[fetchOrders]": async ()=>{
            setLoading(true);
            setError("");
            const res = await fetch(`/api/shopify/orders?userId=${userId}`);
            const data = await res.json();
            if (!res.ok) {
                setError(data.error ?? "Failed to load orders");
                setLoading(false);
                return;
            }
            setOrders(data.orders ?? []);
            setLoading(false);
        }
    }["OrdersList.useCallback[fetchOrders]"], [
        userId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrdersList.useEffect": ()=>{
            fetchOrders();
        }
    }["OrdersList.useEffect"], [
        fetchOrders
    ]);
    // Fetch wallet balance
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrdersList.useEffect": ()=>{
            if (!userId) return;
            fetch(`/api/wallet?userId=${userId}`).then({
                "OrdersList.useEffect": (r)=>r.json()
            }["OrdersList.useEffect"]).then({
                "OrdersList.useEffect": async (d)=>{
                    if (d.balance !== undefined) setWalletBalance(Number(d.balance));
                    const cur = d.currency ?? "INR";
                    setWalletCurrency(cur);
                    if (cur !== "INR") {
                        try {
                            const rr = await fetch(`https://api.frankfurter.app/latest?from=INR&to=${cur}`);
                            if (rr.ok) {
                                const rd = await rr.json();
                                const rate = Number(rd.rates?.[cur] ?? 0);
                                if (rate > 0) setInrToWalletRate(rate);
                            }
                        } catch  {}
                    }
                }
            }["OrdersList.useEffect"]).catch({
                "OrdersList.useEffect": ()=>{}
            }["OrdersList.useEffect"]);
        }
    }["OrdersList.useEffect"], [
        userId
    ]);
    // Auto-fetch shipping rates for all pending domestic orders
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrdersList.useEffect": ()=>{
            const pending = orders.filter({
                "OrdersList.useEffect.pending": (o)=>!o.hlStatus && isDomestic(o) && o.anyMatched
            }["OrdersList.useEffect.pending"]);
            pending.forEach({
                "OrdersList.useEffect": (o)=>{
                    if (shippingRates[o.id] || shippingLoading[o.id]) return;
                    fetchShippingForOrder(o);
                }
            }["OrdersList.useEffect"]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["OrdersList.useEffect"], [
        orders
    ]);
    const fetchShippingForOrder = async (order)=>{
        const pin = order.shipping_address?.zip;
        if (!pin) return;
        setShippingLoading((p)=>({
                ...p,
                [order.id]: true
            }));
        try {
            const qty = order.line_items.reduce((s, l)=>s + (l.quantity ?? 1), 0);
            const weight = Math.max(0.5, Math.ceil((qty * 0.3 + 0.1) / 0.5) * 0.5);
            const res = await fetch("/api/shipping-rates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    pin,
                    country: "IN",
                    weight,
                    qty
                })
            });
            const data = await res.json();
            const raw = data.rates ?? [];
            const options = [];
            const surface = raw.find((r)=>r.id?.toLowerCase().includes("surface") || r.label?.toLowerCase().includes("surface"));
            const air = raw.find((r)=>r.id?.toLowerCase().includes("air") || r.label?.toLowerCase().includes("air"));
            if (surface) options.push({
                type: "surface",
                label: surface.label,
                rate: surface.rate,
                days: surface.days
            });
            if (air) options.push({
                type: "air",
                label: air.label,
                rate: air.rate,
                days: air.days
            });
            if (options.length === 0) {
                options.push({
                    type: "surface",
                    label: "Surface",
                    rate: 80,
                    days: "7–10 days"
                });
                options.push({
                    type: "air",
                    label: "Air",
                    rate: 120,
                    days: "3–5 days"
                });
            }
            setShippingRates((p)=>({
                    ...p,
                    [order.id]: options
                }));
            setSelectedShipping((p)=>({
                    ...p,
                    [order.id]: options[0]
                }));
        } catch  {
            const fallback = [
                {
                    type: "surface",
                    label: "Surface",
                    rate: 80,
                    days: "7–10 days"
                },
                {
                    type: "air",
                    label: "Air",
                    rate: 120,
                    days: "3–5 days"
                }
            ];
            setShippingRates((p)=>({
                    ...p,
                    [order.id]: fallback
                }));
            setSelectedShipping((p)=>({
                    ...p,
                    [order.id]: fallback[0]
                }));
        }
        setShippingLoading((p)=>({
                ...p,
                [order.id]: false
            }));
    };
    const orderCost = (o)=>{
        const prod = o.line_items.reduce((s, l)=>{
            const b = l.hlProduct?.blankPrice ?? 0;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const p = l.hlProduct?.printPrice ?? 0;
            return s + (b + p) * (l.quantity ?? 1);
        }, 0);
        const shp = selectedShipping[o.id]?.rate ?? 0;
        return {
            prod,
            shp,
            total: Math.round(prod + shp)
        };
    };
    // Confirm a single order, returns true on success
    const confirmOrder = async (order)=>{
        setConfirming((prev)=>new Set([
                ...prev,
                order.id
            ]));
        setConfirmErrors((prev)=>{
            const n = {
                ...prev
            };
            delete n[order.id];
            return n;
        });
        const draft = editDrafts[order.id];
        const effectiveAddress = draft ? {
            ...order.shipping_address,
            name: draft.name,
            address1: draft.address1,
            address2: draft.address2,
            city: draft.city,
            province: draft.province,
            zip: draft.zip,
            country: draft.country,
            phone: draft.phone
        } : order.shipping_address;
        const firstMatched = order.line_items.find((l)=>l.hlProduct !== null);
        const { total, shp } = orderCost(order);
        const res = await fetch("/api/shopify/orders/confirm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId,
                shopifyOrderId: order.id,
                shopifyOrderNumber: order.name,
                lineItems: order.line_items,
                shippingAddress: effectiveAddress,
                customerEmail: order.email,
                customerName: effectiveAddress?.name ?? null,
                useWallet: true,
                totalInr: total,
                productName: firstMatched?.hlProduct?.productName ?? order.line_items[0]?.title ?? null,
                colorName: firstMatched?.hlProduct?.colorName ?? null,
                sizeName: firstMatched?.hlProduct?.size ?? null,
                shippingAmount: shp,
                customerPhone: effectiveAddress?.phone ?? null,
                designId: firstMatched?.hlProduct?.productId ?? null,
                note: draft?.note ?? order.note ?? null,
                walletCurrency
            })
        });
        const data = await res.json();
        setConfirming((prev)=>{
            const n = new Set(prev);
            n.delete(order.id);
            return n;
        });
        if (res.status === 402) {
            setConfirmErrors((prev)=>({
                    ...prev,
                    [order.id]: `Insufficient balance (${fmtWallet(data.balance ?? 0)}). Top up in the Wallet tab.`
                }));
            return false;
        }
        if (!res.ok) {
            setConfirmErrors((prev)=>({
                    ...prev,
                    [order.id]: data.error ?? "Failed to confirm"
                }));
            return false;
        }
        return true;
    };
    const handleBulkConfirm = async ()=>{
        const toConfirm = orders.filter((o)=>selected.has(o.id) && !o.hlStatus && o.anyMatched);
        if (!toConfirm.length) return;
        setBulkProgress({
            done: 0,
            total: toConfirm.length
        });
        setBulkConfirming(true);
        for (const order of toConfirm){
            await confirmOrder(order);
            setBulkProgress((p)=>({
                    ...p,
                    done: p.done + 1
                }));
        }
        setBulkConfirming(false);
        setSelected(new Set());
        // Refresh wallet + orders
        fetch(`/api/wallet?userId=${userId}`).then((r)=>r.json()).then((d)=>{
            if (d.balance !== undefined) setWalletBalance(Number(d.balance));
        }).catch(()=>{});
        fetchOrders();
    };
    const toggleExpanded = (id)=>setExpanded((p)=>{
            const n = new Set(p);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    const startEdit = (order)=>{
        if (!editDrafts[order.id]) {
            setEditDrafts((p)=>({
                    ...p,
                    [order.id]: initDraft(order)
                }));
        }
        setEditingId((id)=>id === order.id ? null : order.id);
        if (!expanded.has(order.id)) setExpanded((p)=>new Set([
                ...p,
                order.id
            ]));
    };
    // Derived
    const pending = orders.filter((o)=>!o.hlStatus);
    const confirmed = orders.filter((o)=>!!o.hlStatus);
    const displayed = filter === "pending" ? pending : filter === "confirmed" ? confirmed : orders;
    const readyPending = pending.filter((o)=>o.anyMatched);
    const totalSelectedCost = orders.filter((o)=>selected.has(o.id) && o.anyMatched).reduce((sum, o)=>sum + orderCost(o).total, 0);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2 text-sm text-ds-muted py-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4 animate-spin",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    strokeWidth: 2,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 603,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ShopifyTab.tsx",
                    lineNumber: 602,
                    columnNumber: 9
                }, this),
                "Fetching orders from ",
                shopDomain,
                "…"
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ShopifyTab.tsx",
            lineNumber: 601,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3",
            children: [
                error,
                " — ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: fetchOrders,
                    className: "underline",
                    children: "Retry"
                }, void 0, false, {
                    fileName: "[project]/src/components/ShopifyTab.tsx",
                    lineNumber: 612,
                    columnNumber: 19
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ShopifyTab.tsx",
            lineNumber: 611,
            columnNumber: 7
        }, this);
    }
    if (orders.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm text-ds-muted py-4",
            children: "No orders found in your Shopify store."
        }, void 0, false, {
            fileName: "[project]/src/components/ShopifyTab.tsx",
            lineNumber: 617,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between flex-wrap gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-0.5 bg-black/[0.05] rounded-xl p-1",
                        children: [
                            {
                                id: "pending",
                                label: `Pending · ${pending.length}`
                            },
                            {
                                id: "confirmed",
                                label: `Confirmed · ${confirmed.length}`
                            },
                            {
                                id: "all",
                                label: `All · ${orders.length}`
                            }
                        ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setFilter(tab.id),
                                className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${filter === tab.id ? "bg-white shadow-sm text-ds-dark" : "text-ds-body hover:text-ds-dark"}`,
                                children: tab.label
                            }, tab.id, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 632,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 626,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            walletBalance !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1.5 text-xs font-semibold bg-black/[0.05] text-ds-body rounded-full px-3 py-1",
                                children: [
                                    "💰 ",
                                    fmtWallet(walletBalance)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 644,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: fetchOrders,
                                className: "text-xs text-brand hover:text-brand-dark transition-colors",
                                children: "↻ Refresh"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 648,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 642,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 624,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: filter === "pending" && readyPending.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: -6
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: -6
                    },
                    transition: {
                        duration: 0.2
                    },
                    className: "flex items-center gap-3 px-4 py-2.5 bg-ds-light-gray rounded-xl border border-black/[0.06] flex-wrap",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "flex items-center gap-2 cursor-pointer",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    checked: selected.size > 0 && selected.size === readyPending.length,
                                    ref: (el)=>{
                                        if (el) el.indeterminate = selected.size > 0 && selected.size < readyPending.length;
                                    },
                                    onChange: (e)=>{
                                        if (e.target.checked) setSelected(new Set(readyPending.map((o)=>o.id)));
                                        else setSelected(new Set());
                                    },
                                    className: "rounded"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                    lineNumber: 664,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-semibold text-ds-body",
                                    children: selected.size === 0 ? `Select all (${readyPending.length} ready)` : `${selected.size} selected`
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                    lineNumber: 674,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ShopifyTab.tsx",
                            lineNumber: 663,
                            columnNumber: 13
                        }, this),
                        selected.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-ds-muted",
                                    children: "·"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                    lineNumber: 681,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-ds-body",
                                    children: [
                                        "Total: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold text-ds-dark",
                                            children: fmtWallet(totalSelectedCost)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ShopifyTab.tsx",
                                            lineNumber: 683,
                                            columnNumber: 26
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                    lineNumber: 682,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "ml-auto flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSelected(new Set()),
                                            className: "text-xs text-ds-muted hover:text-ds-body transition-colors",
                                            children: "Clear"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ShopifyTab.tsx",
                                            lineNumber: 686,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleBulkConfirm,
                                            disabled: bulkConfirming,
                                            className: "flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-ds-dark text-white text-xs font-bold hover:bg-ds-dark2 disabled:opacity-50 transition-colors",
                                            children: bulkConfirming ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-3 h-3 animate-spin",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        stroke: "currentColor",
                                                        strokeWidth: 2,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ShopifyTab.tsx",
                                                            lineNumber: 697,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                                        lineNumber: 696,
                                                        columnNumber: 25
                                                    }, this),
                                                    bulkProgress.done,
                                                    "/",
                                                    bulkProgress.total,
                                                    " confirmed…"
                                                ]
                                            }, void 0, true) : `Confirm ${selected.size} order${selected.size !== 1 ? "s" : ""} →`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ShopifyTab.tsx",
                                            lineNumber: 689,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                    lineNumber: 685,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ShopifyTab.tsx",
                    lineNumber: 655,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 653,
                columnNumber: 7
            }, this),
            displayed.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-ds-muted py-4 text-center",
                children: [
                    "No ",
                    filter === "all" ? "" : filter,
                    " orders."
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 714,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: displayed.map((order)=>{
                    const isPending = !order.hlStatus;
                    const isSelected = selected.has(order.id);
                    const isConfirmingThis = confirming.has(order.id);
                    const isEditing = editingId === order.id;
                    const isExpanded = expanded.has(order.id);
                    const draft = editDrafts[order.id];
                    const domestic = isDomestic(order);
                    const rates = shippingRates[order.id];
                    const loadingRates = shippingLoading[order.id];
                    const { prod, shp, total } = orderCost(order);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        layout: true,
                        className: `bg-white rounded-2xl border overflow-hidden transition-colors ${isSelected ? "border-brand-40 ring-1 ring-brand-20" : "border-black/[0.06]"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-4 py-3.5 flex items-start gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-shrink-0 mt-0.5 w-4",
                                        children: isPending && order.anyMatched && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: isSelected,
                                            onChange: (e)=>{
                                                const n = new Set(selected);
                                                if (e.target.checked) n.add(order.id);
                                                else n.delete(order.id);
                                                setSelected(n);
                                            },
                                            className: "rounded w-4 h-4 cursor-pointer"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ShopifyTab.tsx",
                                            lineNumber: 744,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                        lineNumber: 742,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0 space-y-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between gap-2 flex-wrap",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 flex-wrap",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-bold text-sm text-ds-dark",
                                                                children: order.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                                lineNumber: 760,
                                                                columnNumber: 23
                                                            }, this),
                                                            order.hlStatus ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusBadge, {
                                                                status: order.hlStatus
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                                lineNumber: 762,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `text-[10px] rounded-full px-2 py-0.5 font-bold border ${!order.anyMatched ? "bg-red-50 border-red-200 text-red-500" : order.allMatched ? "bg-green-50 border-green-200 text-green-600" : "bg-amber-50 border-amber-200 text-amber-600"}`,
                                                                children: !order.anyMatched ? "SKU unmatched" : order.allMatched ? "✓ All matched" : "Partial match"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                                lineNumber: 764,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                                        lineNumber: 759,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[10px] text-ds-muted flex-shrink-0",
                                                        children: new Date(order.created_at).toLocaleDateString("en-IN", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric"
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                                        lineNumber: 775,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                lineNumber: 758,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-ds-muted",
                                                children: [
                                                    order.email ?? "No email",
                                                    " · ",
                                                    order.currency,
                                                    " ",
                                                    Number(order.total_price).toLocaleString(),
                                                    " paid"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                lineNumber: 781,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-1",
                                                children: order.line_items.map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `inline-flex items-center gap-1 text-[10px] rounded-full px-2 py-0.5 border ${l.hlProduct ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-500"}`,
                                                        children: l.hlProduct ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                l.hlProduct.productName,
                                                                " · ",
                                                                l.hlProduct.colorName,
                                                                " · ",
                                                                l.hlProduct.size,
                                                                " ×",
                                                                l.quantity
                                                            ]
                                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                l.title,
                                                                " ×",
                                                                l.quantity,
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-mono opacity-60",
                                                                    children: [
                                                                        "(",
                                                                        l.sku ?? "no SKU",
                                                                        ")"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                                                    lineNumber: 796,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true)
                                                    }, l.id, false, {
                                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                                        lineNumber: 788,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                lineNumber: 786,
                                                columnNumber: 19
                                            }, this),
                                            isPending && order.anyMatched && domestic && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: loadingRates ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-ds-muted animate-pulse",
                                                    children: "Loading shipping rates…"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                                    lineNumber: 806,
                                                    columnNumber: 25
                                                }, this) : rates?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-1.5",
                                                    children: rates.map((opt)=>{
                                                        const sel = selectedShipping[order.id];
                                                        const active = sel?.type === opt.type;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setSelectedShipping((p)=>({
                                                                        ...p,
                                                                        [order.id]: opt
                                                                    })),
                                                            className: `flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${active ? "bg-ds-dark text-white border-ds-dark" : "bg-white border-black/[0.06] text-ds-body hover:border-zinc-300"}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: opt.type === "surface" ? "🚛" : "✈️"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                                                    lineNumber: 820,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: [
                                                                        "₹",
                                                                        opt.rate
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                                                    lineNumber: 821,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `font-normal ${active ? "text-white/60" : "text-ds-muted"}`,
                                                                    children: opt.days
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                                                    lineNumber: 822,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, opt.type, true, {
                                                            fileName: "[project]/src/components/ShopifyTab.tsx",
                                                            lineNumber: 813,
                                                            columnNumber: 31
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                                    lineNumber: 808,
                                                    columnNumber: 25
                                                }, this) : null
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                lineNumber: 804,
                                                columnNumber: 21
                                            }, this),
                                            isPending && order.anyMatched && prod > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-ds-muted",
                                                children: [
                                                    "Prod: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-ds-body",
                                                        children: fmtWallet(prod)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                                        lineNumber: 834,
                                                        columnNumber: 29
                                                    }, this),
                                                    shp > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            " + Ship: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-semibold text-ds-body",
                                                                children: fmtWallet(shp)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                                lineNumber: 835,
                                                                columnNumber: 46
                                                            }, this)
                                                        ]
                                                    }, void 0, true),
                                                    " · ",
                                                    "Total: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-ds-dark",
                                                        children: fmtWallet(total)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                                        lineNumber: 836,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                lineNumber: 833,
                                                columnNumber: 21
                                            }, this),
                                            !isPending && order.hlOrderRef && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-ds-muted font-mono",
                                                children: [
                                                    order.hlOrderRef,
                                                    order.confirmedAt && ` · ${new Date(order.confirmedAt).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short"
                                                    })}`
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                lineNumber: 842,
                                                columnNumber: 21
                                            }, this),
                                            confirmErrors[order.id] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-red-500 font-semibold",
                                                children: confirmErrors[order.id]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                lineNumber: 850,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                        lineNumber: 755,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col items-end gap-1.5 flex-shrink-0",
                                        children: [
                                            isPending && order.anyMatched && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>confirmOrder(order).then((ok)=>{
                                                        if (ok) {
                                                            fetchOrders();
                                                            fetch(`/api/wallet?userId=${userId}`).then((r)=>r.json()).then((d)=>{
                                                                if (d.balance !== undefined) setWalletBalance(Number(d.balance));
                                                            });
                                                        }
                                                    }),
                                                disabled: isConfirmingThis || bulkConfirming,
                                                className: "flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ds-dark text-white text-xs font-bold hover:bg-ds-dark2 disabled:opacity-40 transition-colors whitespace-nowrap",
                                                children: isConfirmingThis ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-3 h-3 animate-spin",
                                                            fill: "none",
                                                            viewBox: "0 0 24 24",
                                                            stroke: "currentColor",
                                                            strokeWidth: 2,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                                lineNumber: 866,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ShopifyTab.tsx",
                                                            lineNumber: 865,
                                                            columnNumber: 27
                                                        }, this),
                                                        "Confirming…"
                                                    ]
                                                }, void 0, true) : prod > 0 ? `Pay ${fmtWallet(total)} →` : "Confirm →"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                lineNumber: 858,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-0.5",
                                                children: [
                                                    isPending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>startEdit(order),
                                                        title: "Edit shipping details",
                                                        className: `p-1.5 rounded-lg transition-colors ${isEditing ? "bg-brand-10 text-brand" : "text-ds-muted hover:text-ds-body hover:bg-black/[0.05]"}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-3.5 h-3.5",
                                                            fill: "none",
                                                            viewBox: "0 0 24 24",
                                                            stroke: "currentColor",
                                                            strokeWidth: 2,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                                lineNumber: 884,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ShopifyTab.tsx",
                                                            lineNumber: 883,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                                        lineNumber: 881,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>toggleExpanded(order.id),
                                                        title: "View address",
                                                        className: "p-1.5 rounded-lg text-ds-muted hover:text-ds-body hover:bg-black/[0.05] transition-colors",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: `w-3.5 h-3.5 transition-transform ${isExpanded || isEditing ? "rotate-180" : ""}`,
                                                            fill: "none",
                                                            viewBox: "0 0 24 24",
                                                            stroke: "currentColor",
                                                            strokeWidth: 2,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                d: "M19 9l-7 7-7-7"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                                lineNumber: 892,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ShopifyTab.tsx",
                                                            lineNumber: 891,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                                        lineNumber: 889,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                lineNumber: 878,
                                                columnNumber: 19
                                            }, this),
                                            draft && isPending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] font-bold text-brand bg-brand-8 px-1.5 py-0.5 rounded-full",
                                                children: "Edited"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                                lineNumber: 898,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                        lineNumber: 855,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 739,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                initial: false,
                                children: (isExpanded || isEditing) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        height: 0,
                                        opacity: 0
                                    },
                                    animate: {
                                        height: "auto",
                                        opacity: 1
                                    },
                                    exit: {
                                        height: 0,
                                        opacity: 0
                                    },
                                    transition: {
                                        duration: 0.18
                                    },
                                    className: "overflow-hidden",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-t border-black/[0.06] px-5 py-4",
                                        children: isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AddressEditForm, {
                                            draft: draft ?? initDraft(order),
                                            onChange: (d)=>setEditDrafts((p)=>({
                                                        ...p,
                                                        [order.id]: d
                                                    })),
                                            onClose: ()=>setEditingId(null)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ShopifyTab.tsx",
                                            lineNumber: 915,
                                            columnNumber: 25
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AddressDisplay, {
                                            address: draft ?? order.shipping_address,
                                            note: draft?.note ?? order.note,
                                            isEdited: !!draft
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ShopifyTab.tsx",
                                            lineNumber: 921,
                                            columnNumber: 25
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                        lineNumber: 913,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                    lineNumber: 906,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 904,
                                columnNumber: 15
                            }, this)
                        ]
                    }, order.id, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 731,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 717,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ShopifyTab.tsx",
        lineNumber: 621,
        columnNumber: 5
    }, this);
}
_s3(OrdersList, "da4hiKIPYySpIaKhrLL377bHZko=");
_c5 = OrdersList;
function ShopifyTab({ userId }) {
    _s4();
    const [connection, setConnection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loadingConn, setLoadingConn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [subTab, setSubTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("orders");
    const [disconnecting, setDisconnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopifyTab.useEffect": ()=>{
            fetch(`/api/shopify/connect?userId=${userId}`).then({
                "ShopifyTab.useEffect": (r)=>r.json()
            }["ShopifyTab.useEffect"]).then({
                "ShopifyTab.useEffect": (d)=>{
                    setConnection(d.connection ?? null);
                    setLoadingConn(false);
                }
            }["ShopifyTab.useEffect"]);
        }
    }["ShopifyTab.useEffect"], [
        userId
    ]);
    const handleDisconnect = async ()=>{
        if (!confirm("Disconnect your Shopify store?")) return;
        setDisconnecting(true);
        await fetch(`/api/shopify/connect?userId=${userId}`, {
            method: "DELETE"
        });
        setConnection(null);
        setDisconnecting(false);
    };
    if (loadingConn) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2 text-sm text-ds-muted py-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4 animate-spin",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    strokeWidth: 2,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 964,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ShopifyTab.tsx",
                    lineNumber: 963,
                    columnNumber: 9
                }, this),
                "Loading…"
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ShopifyTab.tsx",
            lineNumber: 962,
            columnNumber: 7
        }, this);
    }
    if (!connection) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ConnectForm, {
            userId: userId,
            onConnected: setConnection
        }, void 0, false, {
            fileName: "[project]/src/components/ShopifyTab.tsx",
            lineNumber: 972,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-6 flex-wrap gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-9 h-9 bg-[rgba(150,191,72,0.1)] rounded-xl flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-4 h-4 text-[#96bf48]",
                                    viewBox: "0 0 24 24",
                                    fill: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M15.337 23.979l6.163-1.098c0 0-2.236-15.076-2.256-15.21a.345.345 0 00-.34-.29c-.013 0-.243.005-.243.005s-1.404-1.37-1.92-1.874c.004-.046.008-.093.008-.14V5.37c0-2.96-2.408-5.37-5.371-5.37-2.963 0-5.37 2.41-5.37 5.37v.002c-.516.504-1.92 1.874-1.92 1.874s-.23-.005-.244-.005a.344.344 0 00-.339.29C3.483 7.905 1.5 22.881 1.5 22.881l13.837 1.098zM12.378 1.744a3.627 3.627 0 013.624 3.624v.004l-7.247.004a3.625 3.625 0 013.623-3.632z"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                        lineNumber: 982,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ShopifyTab.tsx",
                                    lineNumber: 981,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 980,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-semibold text-ds-dark text-sm",
                                        style: {
                                            letterSpacing: "-0.02em"
                                        },
                                        children: connection.shop_name ?? connection.shop_domain
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                        lineNumber: 986,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-ds-muted",
                                        children: connection.shop_domain
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                        lineNumber: 989,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 985,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 font-semibold",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-1.5 h-1.5 rounded-full bg-green-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ShopifyTab.tsx",
                                        lineNumber: 992,
                                        columnNumber: 13
                                    }, this),
                                    "Connected"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ShopifyTab.tsx",
                                lineNumber: 991,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 979,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleDisconnect,
                        disabled: disconnecting,
                        className: "text-xs text-ds-muted hover:text-red-500 transition-colors disabled:opacity-40",
                        children: disconnecting ? "Disconnecting…" : "Disconnect store"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 995,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 978,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-1 mb-6 bg-black/[0.05] rounded-xl p-1 w-fit",
                children: [
                    "orders",
                    "skus"
                ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setSubTab(t),
                        className: `px-4 py-2 rounded-lg text-sm font-semibold transition-all ${subTab === t ? "bg-white shadow-sm text-ds-dark" : "text-ds-body hover:text-ds-dark"}`,
                        children: t === "orders" ? "Orders" : "SKU Mapping"
                    }, t, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 1004,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 1002,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                mode: "wait",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 8
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: -8
                    },
                    transition: {
                        duration: 0.15
                    },
                    children: subTab === "orders" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OrdersList, {
                        userId: userId,
                        shopDomain: connection.shop_domain
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 1020,
                        columnNumber: 15
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkuMapper, {
                        userId: userId
                    }, void 0, false, {
                        fileName: "[project]/src/components/ShopifyTab.tsx",
                        lineNumber: 1021,
                        columnNumber: 15
                    }, this)
                }, subTab, false, {
                    fileName: "[project]/src/components/ShopifyTab.tsx",
                    lineNumber: 1012,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ShopifyTab.tsx",
                lineNumber: 1011,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ShopifyTab.tsx",
        lineNumber: 976,
        columnNumber: 5
    }, this);
}
_s4(ShopifyTab, "1y/NFuPFwi9wMtIG9P+XBgfO20M=");
_c6 = ShopifyTab;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "StatusBadge");
__turbopack_context__.k.register(_c1, "AddressDisplay");
__turbopack_context__.k.register(_c2, "AddressEditForm");
__turbopack_context__.k.register(_c3, "ConnectForm");
__turbopack_context__.k.register(_c4, "SkuMapper");
__turbopack_context__.k.register(_c5, "OrdersList");
__turbopack_context__.k.register(_c6, "ShopifyTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_ShopifyTab_tsx_619d1dbb._.js.map