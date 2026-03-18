/**
 * Halftone Labs canonical SKU system
 *
 * Format: HL-{PRODUCT_CODE}-{COLOR_CODE}-{SIZE}
 * Example: HL-RT-WHT-M  →  Regular Tee / White / Medium
 *
 * Merchants set their Shopify product variant SKUs to match these,
 * OR configure custom mappings in the SKU Mapping table.
 */

import { PRODUCTS } from "@/lib/products";

// ── Code maps ────────────────────────────────────────────────────────────────

const PRODUCT_CODES: Record<string, string> = {
  "regular-tee":       "RT",
  "oversized-tee-sj":  "OSJ",
  "oversized-tee-ft":  "OFT",
  "baby-tee":          "BT",
};

const COLOR_CODES: Record<string, string> = {
  "White":      "WHT",
  "Black":      "BLK",
  "Navy":       "NVY",
  "Royal Blue": "RBL",
  "Red":        "RED",
  "Mocha":      "MCH",
  "Baby Pink":  "PNK",
};

// ── SKU entry ────────────────────────────────────────────────────────────────

export interface HLSku {
  sku:         string;    // e.g. "HL-RT-WHT-M"
  productId:   string;
  productName: string;
  colorName:   string;
  colorHex:    string;
  size:        string;
  gsm:         string;
  blankPrice:  number;
}

// ── Generate full catalog ─────────────────────────────────────────────────────

export function generateSkuCatalog(): HLSku[] {
  const catalog: HLSku[] = [];
  for (const product of PRODUCTS) {
    const pCode = PRODUCT_CODES[product.id];
    if (!pCode) continue;
    for (const color of product.colors) {
      const cCode = COLOR_CODES[color.name];
      if (!cCode) continue;
      for (const size of product.sizes) {
        catalog.push({
          sku:         `HL-${pCode}-${cCode}-${size.replace(/\s/g, "")}`,
          productId:   product.id,
          productName: product.name,
          colorName:   color.name,
          colorHex:    color.hex,
          size,
          gsm:         product.gsm,
          blankPrice:  product.blankPrice,
        });
      }
    }
  }
  return catalog;
}

/** Look up our SKU in the catalog. Returns null if not found. */
export function lookupSku(sku: string): HLSku | null {
  return generateSkuCatalog().find((s) => s.sku === sku) ?? null;
}

/** Exported singleton catalog (built once at module level) */
export const SKU_CATALOG = generateSkuCatalog();
