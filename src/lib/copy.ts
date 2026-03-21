/**
 * Region-aware copy system.
 *
 * isIndia = true  → user is on INR currency (India)
 * isIndia = false → user is on USD/EUR (global)
 *
 * Usage:
 *   const { isIndia } = useCurrency();
 *   const c = copy(isIndia);
 *   <h1>{c.heroHeadline}</h1>
 */

export interface RegionCopy {
  // General
  studioTagline: string;
  studioTaglineShort: string;
  forWho: string;

  // Hero / homepage
  heroSubtitle: string;
  heroStat1Value: string;
  heroStat1Label: string;
  heroStat2Value: string;
  heroStat2Label: string;
  heroStat3Value: string;
  heroStat3Label: string;
  heroBadge: string;
  heroCommerceTag: string;

  // Shipping & delivery
  shippingLine: string;
  deliveryTime: string;
  fulfillmentNote: string;

  // About
  aboutHeroHeadline: string;
  aboutStory1: string;
  aboutStory2: string;
  aboutStory3: string;
  aboutFoundedLabel: string;
  aboutHqValue: string;
  aboutScaleLabel: string;
  aboutScaleValue: string;

  // Careers
  careersHeadline: string;
  careersSubtitle: string;
  careersPerk3Title: string;
  careersPerk3Body: string;

  // Bulk orders
  bulkDeliveryNote: string;
  bulkStep4Body: string;

  // How it works
  howStep1Body: string;
  howStep5Body: string;

  // Become a partner
  partnerHeadline: string;
  partnerSubtitle: string;

  // Footer
  footerTagline: string;
  footerLocation: string;

  // Sustainability
  sustainLocal: string;

  // Quality
  qualityHeroSub: string;
}

const india: RegionCopy = {
  studioTagline: "India's leading independent merch studio",
  studioTaglineShort: "India's merch studio",
  forWho: "For Indian artists, labels, and brands",

  heroSubtitle:
    "India's premium custom merch studio. DTG & DTF print-on-demand, MOQ 1, ships pan-India in 5–7 days.",
  heroStat1Value: "10,000+",
  heroStat1Label: "units shipped across India",
  heroStat2Value: "500+",
  heroStat2Label: "artists & brands served",
  heroStat3Value: "48h",
  heroStat3Label: "avg. production time",
  heroBadge: "India-made",
  heroCommerceTag: "Drop commerce platform · India",

  shippingLine: "Ships pan-India in 5–7 days",
  deliveryTime: "5–7 business days domestic",
  fulfillmentNote: "Every blank is combed cotton, cut and fulfilled from India.",

  aboutHeroHeadline: "We make merch that artists are proud to sell.",
  aboutStory1:
    "We've been on both sides of the table — as artists ordering merch, and as the people printing it. We know what goes wrong: files that aren't checked, blanks that shrink after one wash, colours that fade.",
  aboutStory2:
    "So we built a studio that operates differently. Every file is reviewed by a human before it touches a garment. Every blank we stock has been tested. Every print is checked before it ships.",
  aboutStory3:
    "We're based in India, shipping pan-India, and we're proud to work with some of the country's most exciting independent artists, labels, and creator brands.",
  aboutFoundedLabel: "Founded",
  aboutHqValue: "India",
  aboutScaleLabel: "Garments printed",
  aboutScaleValue: "10,000+",

  careersHeadline: "Build the future of creator merch in India.",
  careersSubtitle:
    "We're a small, passionate team building the infrastructure for independent artists to sell merch they're proud of. If that excites you, keep reading.",
  careersPerk3Title: "India-based & independent",
  careersPerk3Body: "We're not a corporate. We move fast, try things, and actually listen.",

  bulkDeliveryNote: "Pan-India delivery",
  bulkStep4Body:
    "We keep you updated throughout. Final balance on dispatch. Pan-India delivery in 5–7 days.",

  howStep1Body:
    "Browse the Studio catalog — Regular Tee, Oversized, Baby Tee, and more. Pick your base garment, colour, and GSM weight. Every blank is combed cotton, cut and fulfilled from India.",
  howStep5Body:
    "Domestic orders via Shiprocket, delivered in 5–7 business days. International orders reach most destinations in 10–18 days. Track your order in real time from your Halftone account.",

  partnerHeadline: "Your merch. Our production.",
  partnerSubtitle:
    "We partner with artists, labels, agencies, and event companies who need a reliable, high-quality merch production partner they can count on drop after drop.",

  footerTagline: "India's independent merch studio for artists, creators, and brands.",
  footerLocation: "India — hello@halftonelabs.in",

  sustainLocal:
    "Everything is produced in India. Shorter supply chains mean fewer freight miles, lower carbon emissions, and faster delivery to you.",

  qualityHeroSub:
    "We don't automate quality. Every file is reviewed by a human, every print is inspected before dispatch, and every order comes with our commitment to make it right if something isn't.",
};

const global: RegionCopy = {
  studioTagline: "The merch studio for artists everywhere",
  studioTaglineShort: "Global merch studio",
  forWho: "For artists, labels, and brands worldwide",

  heroSubtitle:
    "Custom merch built for artists worldwide. DTG & DTF print-on-demand, MOQ 1, shipping globally in 5–18 days.",
  heroStat1Value: "10,000+",
  heroStat1Label: "units shipped worldwide",
  heroStat2Value: "500+",
  heroStat2Label: "artists & brands served globally",
  heroStat3Value: "48h",
  heroStat3Label: "avg. production time",
  heroBadge: "Ships worldwide",
  heroCommerceTag: "Drop commerce platform · Global",

  shippingLine: "Ships worldwide in 5–18 days",
  deliveryTime: "5–18 business days worldwide",
  fulfillmentNote: "Every blank is combed cotton, crafted to order and shipped globally.",

  aboutHeroHeadline: "We make merch that artists everywhere are proud to sell.",
  aboutStory1:
    "We've been on both sides of the table — as artists ordering merch, and as the people printing it. We know what goes wrong: files that aren't checked, blanks that shrink after one wash, colours that fade.",
  aboutStory2:
    "So we built a studio that operates differently. Every file is reviewed by a human before it touches a garment. Every blank we stock has been tested. Every print is checked before it ships.",
  aboutStory3:
    "We ship to artists and brands worldwide, and we're proud to work with some of the most exciting independent artists, labels, and creator brands across the globe.",
  aboutFoundedLabel: "Founded",
  aboutHqValue: "Global (HQ in India)",
  aboutScaleLabel: "Garments shipped worldwide",
  aboutScaleValue: "10,000+",

  careersHeadline: "Build the future of creator merch. Globally.",
  careersSubtitle:
    "We're a small, passionate team building the global infrastructure for independent artists to sell merch they're proud of. If that excites you, keep reading.",
  careersPerk3Title: "Independent & global",
  careersPerk3Body: "We're not a corporate. We ship to artists worldwide, move fast, and actually listen.",

  bulkDeliveryNote: "Worldwide delivery",
  bulkStep4Body:
    "We keep you updated throughout. Final balance on dispatch. Worldwide shipping in 5–18 business days.",

  howStep1Body:
    "Browse the Studio catalog — Regular Tee, Oversized, Baby Tee, and more. Pick your base garment, colour, and GSM weight. Every blank is combed cotton, crafted to order and shipped globally.",
  howStep5Body:
    "Orders ship worldwide — most destinations reached in 5–18 business days. Track your order in real time from your Halftone account.",

  partnerHeadline: "Your merch. Our global production.",
  partnerSubtitle:
    "We partner with artists, labels, agencies, and event companies worldwide who need a reliable, high-quality merch production partner they can count on drop after drop.",

  footerTagline: "The merch studio for artists, creators, and brands everywhere.",
  footerLocation: "Global — hello@halftonelabs.in",

  sustainLocal:
    "Our production is centralised for quality control, and we ship via optimised global carriers to minimise freight miles and emissions.",

  qualityHeroSub:
    "We don't automate quality. Every file is reviewed by a human, every print is inspected before dispatch, and every order — wherever it ships — comes with our commitment to make it right.",
};

export function copy(isIndia: boolean): RegionCopy {
  return isIndia ? india : global;
}
