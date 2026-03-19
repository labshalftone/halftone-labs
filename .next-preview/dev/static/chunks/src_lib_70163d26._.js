(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/src/lib/products.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─── SHARED PRODUCT DATA ──────────────────────────────────────────────────────
// No "use client" — plain data module usable in server and client components.
__turbopack_context__.s([
    "PRINT_TIERS",
    ()=>PRINT_TIERS,
    "PRODUCTS",
    ()=>PRODUCTS,
    "getTier",
    ()=>getTier
]);
const PRINT_TIERS = [
    {
        label: '5×5"',
        sqin: 25,
        price: 120
    },
    {
        label: '6×10"',
        sqin: 60,
        price: 180
    },
    {
        label: '8.5×11"',
        sqin: 93.5,
        price: 230
    },
    {
        label: '12×12"',
        sqin: 144,
        price: 280
    },
    {
        label: '14×16"',
        sqin: 224,
        price: 330
    },
    {
        label: '19×15.5"',
        sqin: 294.5,
        price: 400
    }
];
function getTier(sqin) {
    return PRINT_TIERS.find((t)=>sqin <= t.sqin) ?? PRINT_TIERS[PRINT_TIERS.length - 1];
}
const PRODUCTS = [
    {
        id: "regular-tee",
        name: "Regular Tee",
        gsm: "180 GSM",
        spec: "100% combed ring-spun cotton",
        fit: "Regular unisex fit, slightly tapered",
        blankPrice: 400,
        sizes: [
            "S",
            "M",
            "L",
            "XL",
            "2XL"
        ],
        colors: [
            {
                name: "White",
                hex: "#FFFFFF",
                border: true,
                mockupFront: "/mockups/regular-tee/Mannequin_Image4.png",
                mockupBack: "/mockups/regular-tee/Mannequin_Image9.png"
            },
            {
                name: "Black",
                hex: "#111111",
                mockupFront: "/mockups/regular-tee/Mannequin_Image5.png",
                mockupBack: "/mockups/regular-tee/Mannequin_Image10.png"
            },
            {
                name: "Navy",
                hex: "#1B2A4A",
                mockupFront: "/mockups/regular-tee/Mannequin_Image1.png",
                mockupBack: "/mockups/regular-tee/Mannequin_Image6.png"
            },
            {
                name: "Royal Blue",
                hex: "#2563EB",
                mockupFront: "/mockups/regular-tee/Mannequin_Image2.png",
                mockupBack: "/mockups/regular-tee/Mannequin_Image7.png"
            },
            {
                name: "Red",
                hex: "#C0392B",
                mockupFront: "/mockups/regular-tee/Mannequin_Image3.png",
                mockupBack: "/mockups/regular-tee/Mannequin_Image8.png"
            }
        ],
        bulkTiers: [
            {
                qty: "50–99",
                priceInr: 349
            },
            {
                qty: "100–249",
                priceInr: 299
            },
            {
                qty: "250+",
                priceInr: 249
            }
        ],
        tag: "Bestseller",
        description: "A clean, versatile tee engineered for everyday wear and bold graphics. The 180 GSM combed ring-spun cotton delivers a crisp, premium hand-feel that holds our DTG prints with exceptional clarity. Slightly tapered for a flattering silhouette without sacrificing comfort.",
        sizeGuideKey: "regular"
    },
    {
        id: "oversized-tee-sj",
        name: "Oversized Tee",
        gsm: "220 GSM · Single Jersey",
        spec: "100% combed cotton, single jersey knit",
        fit: "Drop-shoulder oversized, loopback",
        blankPrice: 500,
        sizes: [
            "S",
            "M",
            "L",
            "XL",
            "2XL"
        ],
        colors: [
            {
                name: "White",
                hex: "#FFFFFF",
                border: true,
                mockupFront: "/mockups/oversized-sj/Mannequin_Image1.png",
                mockupBack: "/mockups/oversized-sj/Mannequin_Image3.png"
            },
            {
                name: "Black",
                hex: "#111111",
                mockupFront: "/mockups/oversized-sj/Mannequin_Image2.png",
                mockupBack: "/mockups/oversized-sj/Mannequin_Image4.png"
            }
        ],
        bulkTiers: [
            {
                qty: "50–99",
                priceInr: 449
            },
            {
                qty: "100–249",
                priceInr: 399
            },
            {
                qty: "250+",
                priceInr: 349
            }
        ],
        tag: "New",
        description: "A heavier, relaxed silhouette with the structure to carry statement graphics. The 220 GSM single jersey construction gives it the body you want without the stiffness — perfect for oversized fits that actually look intentional.",
        sizeGuideKey: "oversized-sj"
    },
    {
        id: "oversized-tee-ft",
        name: "Oversized Tee",
        gsm: "240 GSM · French Terry",
        spec: "100% combed cotton, french terry",
        fit: "Drop-shoulder oversized, looped back",
        blankPrice: 600,
        sizes: [
            "S",
            "M",
            "L",
            "XL",
            "2XL"
        ],
        colors: [
            {
                name: "White",
                hex: "#FFFFFF",
                border: true,
                mockupFront: "/mockups/oversized-ft/Mannequin_Image1.png",
                mockupBack: "/mockups/oversized-ft/Mannequin_Image4.png"
            },
            {
                name: "Black",
                hex: "#111111",
                mockupFront: "/mockups/oversized-ft/Mannequin_Image2.png",
                mockupBack: "/mockups/oversized-ft/Mannequin_Image5.png"
            },
            {
                name: "Mocha",
                hex: "#5C3D2E",
                mockupFront: "/mockups/oversized-ft/Mannequin_Image3.png",
                mockupBack: "/mockups/oversized-ft/Mannequin_Image6.png"
            }
        ],
        bulkTiers: [
            {
                qty: "50–99",
                priceInr: 549
            },
            {
                qty: "100–249",
                priceInr: 499
            },
            {
                qty: "250+",
                priceInr: 449
            }
        ],
        tag: null,
        description: "The premium heavyweight in our lineup. 240 GSM french terry gives you a looped interior for warmth, breathability, and a supple drape that gets better with every wash. Drop-shoulder cut with a relaxed boxy fall.",
        sizeGuideKey: "oversized-ft"
    },
    {
        id: "baby-tee",
        name: "Baby Tee",
        gsm: "180 GSM",
        spec: "100% combed ring-spun cotton",
        fit: "Cropped fitted cut, women's silhouette",
        blankPrice: 380,
        sizes: [
            "XS",
            "S",
            "M",
            "L",
            "XL"
        ],
        colors: [
            {
                name: "White",
                hex: "#FFFFFF",
                border: true,
                mockupFront: "/mockups/baby-tee/Mannequin_Image1.png",
                mockupBack: "/mockups/baby-tee/Mannequin_Image3.png"
            },
            {
                name: "Black",
                hex: "#111111",
                mockupFront: "/mockups/baby-tee/Mannequin_Image5.png",
                mockupBack: "/mockups/baby-tee/Mannequin_Image6.png"
            },
            {
                name: "Baby Pink",
                hex: "#F5C2C7",
                mockupFront: "/mockups/baby-tee/Mannequin_Image2.png",
                mockupBack: "/mockups/baby-tee/Mannequin_Image4.png"
            }
        ],
        bulkTiers: [
            {
                qty: "50–99",
                priceInr: 329
            },
            {
                qty: "100–249",
                priceInr: 279
            },
            {
                qty: "250+",
                priceInr: 239
            }
        ],
        tag: null,
        description: "Cut short and fitted through the body — designed specifically for a women's silhouette. The 180 GSM combed cotton keeps it lightweight and breathable while the snug fit makes it a canvas for bold, expressive prints.",
        sizeGuideKey: "baby"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/shopify-skus.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SKU_CATALOG",
    ()=>SKU_CATALOG,
    "generateSkuCatalog",
    ()=>generateSkuCatalog,
    "lookupSku",
    ()=>lookupSku
]);
/**
 * Halftone Labs canonical SKU system
 *
 * Format: HL-{PRODUCT_CODE}-{COLOR_CODE}-{SIZE}
 * Example: HL-RT-WHT-M  →  Regular Tee / White / Medium
 *
 * Merchants set their Shopify product variant SKUs to match these,
 * OR configure custom mappings in the SKU Mapping table.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/products.ts [app-client] (ecmascript)");
;
// ── Code maps ────────────────────────────────────────────────────────────────
const PRODUCT_CODES = {
    "regular-tee": "RT",
    "oversized-tee-sj": "OSJ",
    "oversized-tee-ft": "OFT",
    "baby-tee": "BT"
};
const COLOR_CODES = {
    "White": "WHT",
    "Black": "BLK",
    "Navy": "NVY",
    "Royal Blue": "RBL",
    "Red": "RED",
    "Mocha": "MCH",
    "Baby Pink": "PNK"
};
function generateSkuCatalog() {
    const catalog = [];
    for (const product of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"]){
        const pCode = PRODUCT_CODES[product.id];
        if (!pCode) continue;
        for (const color of product.colors){
            const cCode = COLOR_CODES[color.name];
            if (!cCode) continue;
            for (const size of product.sizes){
                catalog.push({
                    sku: `HL-${pCode}-${cCode}-${size.replace(/\s/g, "")}`,
                    productId: product.id,
                    productName: product.name,
                    colorName: color.name,
                    colorHex: color.hex,
                    size,
                    gsm: product.gsm,
                    blankPrice: product.blankPrice
                });
            }
        }
    }
    return catalog;
}
function lookupSku(sku) {
    return generateSkuCatalog().find((s)=>s.sku === sku) ?? null;
}
const SKU_CATALOG = generateSkuCatalog();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_lib_70163d26._.js.map