// ─── SHARED PRODUCT DATA ──────────────────────────────────────────────────────
// No "use client" — plain data module usable in server and client components.

import type { ProductKey } from "@/components/SizeGuide";
import type { PlanKey } from "@/lib/plans";

export const PRINT_TIERS = [
  { label: '5×5"',     sqin: 25,    price: 120 },
  { label: '6×10"',    sqin: 60,    price: 180 },
  { label: '8.5×11"',  sqin: 93.5,  price: 230 },
  { label: '12×12"',   sqin: 144,   price: 280 },
  { label: '14×16"',   sqin: 224,   price: 330 },
  { label: '19×15.5"', sqin: 294.5, price: 400 },
];

export function getTier(sqin: number) {
  return PRINT_TIERS.find((t) => sqin <= t.sqin) ?? PRINT_TIERS[PRINT_TIERS.length - 1];
}

export const PRODUCTS = [
  {
    id: "regular-tee",
    name: "Regular Tee",
    gsm: "180 GSM",
    spec: "100% combed ring-spun cotton",
    fit: "Regular unisex fit, slightly tapered",
    blankPrice: 400,
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [
      {
        name: "White", hex: "#FFFFFF", border: true,
        mockupFront: "/mockups/regular-tee/Mannequin_Image4.png",
        mockupBack:  "/mockups/regular-tee/Mannequin_Image9.png",
      },
      {
        name: "Black", hex: "#111111",
        mockupFront: "/mockups/regular-tee/Mannequin_Image5.png",
        mockupBack:  "/mockups/regular-tee/Mannequin_Image10.png",
      },
      {
        name: "Navy", hex: "#1B2A4A",
        mockupFront: "/mockups/regular-tee/Mannequin_Image1.png",
        mockupBack:  "/mockups/regular-tee/Mannequin_Image6.png",
      },
      {
        name: "Royal Blue", hex: "#2563EB",
        mockupFront: "/mockups/regular-tee/Mannequin_Image2.png",
        mockupBack:  "/mockups/regular-tee/Mannequin_Image7.png",
      },
      {
        name: "Red", hex: "#C0392B",
        mockupFront: "/mockups/regular-tee/Mannequin_Image3.png",
        mockupBack:  "/mockups/regular-tee/Mannequin_Image8.png",
      },
    ],
    bulkTiers: [
      { qty: "50–99",   priceInr: 349 },
      { qty: "100–249", priceInr: 299 },
      { qty: "250+",    priceInr: 249 },
    ],
    tag: "Bestseller" as string | null,
    description:
      "A clean, versatile tee engineered for everyday wear and bold graphics. The 180 GSM combed ring-spun cotton delivers a crisp, premium hand-feel that holds our DTG prints with exceptional clarity. Slightly tapered for a flattering silhouette without sacrificing comfort.",
    sizeGuideKey: "regular" as ProductKey,
    planRequired: undefined as PlanKey | undefined,
  },
  {
    id: "oversized-tee-sj",
    name: "Oversized Tee",
    gsm: "220 GSM · Single Jersey",
    spec: "100% combed cotton, single jersey knit",
    fit: "Drop-shoulder oversized, loopback",
    blankPrice: 500,
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [
      {
        name: "White", hex: "#FFFFFF", border: true,
        mockupFront: "/mockups/oversized-sj/Mannequin_Image1.png",
        mockupBack:  "/mockups/oversized-sj/Mannequin_Image3.png",
      },
      {
        name: "Black", hex: "#111111",
        mockupFront: "/mockups/oversized-sj/Mannequin_Image2.png",
        mockupBack:  "/mockups/oversized-sj/Mannequin_Image4.png",
      },
    ],
    bulkTiers: [
      { qty: "50–99",   priceInr: 449 },
      { qty: "100–249", priceInr: 399 },
      { qty: "250+",    priceInr: 349 },
    ],
    tag: "New" as string | null,
    description:
      "A heavier, relaxed silhouette with the structure to carry statement graphics. The 220 GSM single jersey construction gives it the body you want without the stiffness — perfect for oversized fits that actually look intentional.",
    sizeGuideKey: "oversized-sj" as ProductKey,
    planRequired: undefined as PlanKey | undefined,
  },
  {
    id: "oversized-tee-ft",
    name: "Oversized Tee",
    gsm: "240 GSM · French Terry",
    spec: "100% combed cotton, french terry",
    fit: "Drop-shoulder oversized, looped back",
    blankPrice: 600,
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [
      {
        name: "White", hex: "#FFFFFF", border: true,
        mockupFront: "/mockups/oversized-ft/Mannequin_Image1.png",
        mockupBack:  "/mockups/oversized-ft/Mannequin_Image4.png",
      },
      {
        name: "Black", hex: "#111111",
        mockupFront: "/mockups/oversized-ft/Mannequin_Image2.png",
        mockupBack:  "/mockups/oversized-ft/Mannequin_Image5.png",
      },
      {
        name: "Mocha", hex: "#5C3D2E",
        mockupFront: "/mockups/oversized-ft/Mannequin_Image3.png",
        mockupBack:  "/mockups/oversized-ft/Mannequin_Image6.png",
      },
    ],
    bulkTiers: [
      { qty: "50–99",   priceInr: 549 },
      { qty: "100–249", priceInr: 499 },
      { qty: "250+",    priceInr: 449 },
    ],
    tag: null as string | null,
    description:
      "The premium heavyweight in our lineup. 240 GSM french terry gives you a looped interior for warmth, breathability, and a supple drape that gets better with every wash. Drop-shoulder cut with a relaxed boxy fall.",
    sizeGuideKey: "oversized-ft" as ProductKey,
    planRequired: undefined as PlanKey | undefined,
  },
  {
    id: "baby-tee",
    name: "Baby Tee",
    gsm: "180 GSM",
    spec: "100% combed ring-spun cotton",
    fit: "Cropped fitted cut, women's silhouette",
    blankPrice: 380,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      {
        name: "White", hex: "#FFFFFF", border: true,
        mockupFront: "/mockups/baby-tee/Mannequin_Image1.png",
        mockupBack:  "/mockups/baby-tee/Mannequin_Image3.png",
      },
      {
        name: "Black", hex: "#111111",
        mockupFront: "/mockups/baby-tee/Mannequin_Image5.png",
        mockupBack:  "/mockups/baby-tee/Mannequin_Image6.png",
      },
      {
        name: "Baby Pink", hex: "#F5C2C7",
        mockupFront: "/mockups/baby-tee/Mannequin_Image2.png",
        mockupBack:  "/mockups/baby-tee/Mannequin_Image4.png",
      },
    ],
    bulkTiers: [
      { qty: "50–99",   priceInr: 329 },
      { qty: "100–249", priceInr: 279 },
      { qty: "250+",    priceInr: 239 },
    ],
    tag: null as string | null,
    description:
      "Cut short and fitted through the body — designed specifically for a women's silhouette. The 180 GSM combed cotton keeps it lightweight and breathable while the snug fit makes it a canvas for bold, expressive prints.",
    sizeGuideKey: "baby" as ProductKey,
    planRequired: undefined as PlanKey | undefined,
  },
  {
    id: "hoodie",
    name: "Hoodie",
    gsm: "320 GSM",
    spec: "80% cotton, 20% polyester, fleece lined",
    fit: "Relaxed unisex fit, kangaroo pocket, adjustable drawstring",
    blankPrice: 900,
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [
      {
        name: "Black", hex: "#111111",
        mockupFront: "/mockups/hoodie/Mannequin_Image1.png",
        mockupBack:  "/mockups/hoodie/Mannequin_Image2.png",
      },
      {
        name: "White", hex: "#FFFFFF", border: true,
        mockupFront: "/mockups/hoodie/Mannequin_Image3.png",
        mockupBack:  "/mockups/hoodie/Mannequin_Image4.png",
      },
      {
        name: "Navy", hex: "#1B2A4A",
        mockupFront: "/mockups/hoodie/Mannequin_Image5.png",
        mockupBack:  "/mockups/hoodie/Mannequin_Image6.png",
      },
    ],
    bulkTiers: [
      { qty: "50–99",   priceInr: 799 },
      { qty: "100–249", priceInr: 699 },
      { qty: "250+",    priceInr: 599 },
    ],
    tag: "Scale+" as string | null,
    description:
      "A premium 320 GSM fleece hoodie built for streetwear drops and cold-season releases. The heavy cotton-poly blend gives it the weight and structure that makes a hoodie feel like an investment piece.",
    sizeGuideKey: "regular" as ProductKey,
    planRequired: "scale" as PlanKey | undefined,
  },
  {
    id: "waffle-tee",
    name: "Waffle Tee",
    gsm: "200 GSM",
    spec: "100% combed cotton, waffle-knit texture",
    fit: "Relaxed fit, textured surface",
    blankPrice: 550,
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: [
      {
        name: "Ecru", hex: "#F5F0E8", border: true,
        mockupFront: "/mockups/waffle-tee/Mannequin_Image1.png",
        mockupBack:  "/mockups/waffle-tee/Mannequin_Image2.png",
      },
      {
        name: "Black", hex: "#111111",
        mockupFront: "/mockups/waffle-tee/Mannequin_Image3.png",
        mockupBack:  "/mockups/waffle-tee/Mannequin_Image4.png",
      },
      {
        name: "Slate", hex: "#64748B",
        mockupFront: "/mockups/waffle-tee/Mannequin_Image5.png",
        mockupBack:  "/mockups/waffle-tee/Mannequin_Image6.png",
      },
    ],
    bulkTiers: [
      { qty: "50–99",   priceInr: 499 },
      { qty: "100–249", priceInr: 449 },
      { qty: "250+",    priceInr: 399 },
    ],
    tag: "Scale+" as string | null,
    description:
      "A distinctive textured tee with a waffle-knit surface that gives prints a unique, tactile feel. Perfect for elevated basics collections and brands that want something beyond standard jersey.",
    sizeGuideKey: "regular" as ProductKey,
    planRequired: "scale" as PlanKey | undefined,
  },
];

export type Product = (typeof PRODUCTS)[0];
export type ProductColor = (typeof PRODUCTS)[0]["colors"][0];
