import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { CurrencyProvider } from "@/lib/currency-context";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Halftone Labs — Merch for Artists, Labels & Festivals",
    template: "%s | Halftone Labs",
  },
  description:
    "India's premium custom merch studio. DTG & DTF print-on-demand, MOQ 1, 5–7 day shipping. Trusted by Sunburn Festival, Galactica, Kevin Abstract and 60+ artists.",
  keywords: [
    "custom merch india", "dtg printing india", "artist merchandise",
    "festival merch", "print on demand india", "custom t-shirts india",
    "music merch india", "halftone labs",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://halftonelabs.in",
    siteName: "Halftone Labs",
    title: "Halftone Labs — Merch Infrastructure for Artists & Labels",
    description:
      "Design, print, and ship custom merch in 5–7 days. MOQ 1. DTG & DTF printing from India.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Halftone Labs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Halftone Labs — Merch for Artists & Labels",
    description: "MOQ 1 custom merch, 5–7 day shipping from India.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://halftonelabs.in"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <CurrencyProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
