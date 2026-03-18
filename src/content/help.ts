export type HelpArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  relatedSlugs?: string[];
  status: "draft" | "published";
  body: string; // HTML
};

export const HELP_CATEGORIES = [
  { id: "getting-started",   label: "Getting Started",       icon: "🚀", description: "Account setup, first steps" },
  { id: "studio",            label: "Studio & Products",     icon: "🎨", description: "Designing and creating products" },
  { id: "drops",             label: "Drops & Collections",   icon: "⚡", description: "Creating and managing drops" },
  { id: "orders",            label: "Orders & Fulfilment",   icon: "📦", description: "Order tracking and delivery" },
  { id: "stores-orgs",       label: "Stores & Orgs",         icon: "🏪", description: "Setting up stores and organisations" },
  { id: "payouts",           label: "Payouts & Billing",     icon: "💳", description: "Revenue, payouts, invoicing" },
  { id: "troubleshooting",   label: "Troubleshooting",       icon: "🔧", description: "Common issues and fixes" },
];

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: "create-your-first-product",
    title: "How to Create Your First Product",
    excerpt: "Step-by-step guide to adding a product design in Halftone Studio.",
    category: "studio",
    tags: ["studio", "product", "design", "getting-started"],
    relatedSlugs: ["launch-a-drop", "scheduled-drops"],
    status: "published",
    body: `
<h2>What you'll need</h2>
<ul>
  <li>Your design file as a PNG, JPG or SVG (minimum 150 DPI for print quality)</li>
  <li>A Halftone account (free to create)</li>
</ul>

<h2>Step 1: Open Studio</h2>
<p>From your account dashboard, click <strong>Studio</strong> in the top navigation, or go to <a href="/studio">/studio</a>. You'll see a product catalogue — hoodies, tees, caps, and more.</p>

<h2>Step 2: Choose a base product</h2>
<p>Click on the product you want to customise. You'll enter the product editor where you can:</p>
<ul>
  <li>Select a colourway</li>
  <li>Switch between front and back placement</li>
  <li>Choose your print technique (DTF, screen print, embroidery)</li>
</ul>

<h2>Step 3: Upload your artwork</h2>
<ol>
  <li>Click the upload zone on the product mockup</li>
  <li>Select your file — PNG works best for artwork with transparency</li>
  <li>Resize and reposition using the handles</li>
  <li>Use the alignment tools to centre your artwork</li>
</ol>
<p><strong>Tip:</strong> For best print results, use artwork at 150 DPI or higher at your target print size.</p>

<h2>Step 4: Preview and save</h2>
<p>Once you're happy with the placement, click <strong>Save Design</strong>. Your design is now in your Designs library and can be added to any drop.</p>

<h2>Common issues</h2>
<ul>
  <li><strong>Design looks pixelated in preview:</strong> Use a higher-resolution source file</li>
  <li><strong>Wrong colour on print:</strong> CMYK colours can appear slightly different from screen RGB. Provide a CMYK file for accurate colour matching.</li>
  <li><strong>Upload fails:</strong> Check that the file is under 20MB. Convert large files to a compressed PNG.</li>
</ul>
`,
  },

  {
    slug: "launch-a-drop",
    title: "How to Launch a Drop",
    excerpt: "Everything you need to know about creating and publishing a drop on Halftone.",
    category: "drops",
    tags: ["drops", "launch", "publish"],
    relatedSlugs: ["scheduled-drops", "waitlist-collection", "create-your-first-product"],
    status: "published",
    body: `
<h2>Before you start</h2>
<p>Make sure you have at least one design in your Designs library. If not, <a href="/help/create-your-first-product">create your first product</a> first.</p>

<h2>Opening the Drop Builder</h2>
<p>Go to <strong>Drops</strong> in your dashboard sidebar and click <strong>New Drop</strong>. The 6-step Drop Builder will open.</p>

<h2>Step 1: Basics</h2>
<ul>
  <li><strong>Title:</strong> The name of your drop (e.g. "Summer 2025" or "Keinemusik x Halftone")</li>
  <li><strong>Slug:</strong> Auto-generated from your title — this becomes your drop URL</li>
  <li><strong>Description:</strong> Tell the story of the drop. Why does it exist?</li>
  <li><strong>Store:</strong> Select which of your stores this drop belongs to</li>
  <li><strong>Cover image:</strong> A hero image for the drop page (optional but recommended)</li>
</ul>

<h2>Step 2: Products</h2>
<p>Select which designs to include in this drop. You can mark one as the featured product — it appears first on the drop page.</p>

<h2>Step 3: Commerce</h2>
<ul>
  <li><strong>Limited quantity:</strong> Set a cap on units. Shows "X remaining" on the drop page.</li>
  <li><strong>Preorder:</strong> Collect orders before production is complete</li>
  <li><strong>COD:</strong> Enable cash on delivery (if supported in your region)</li>
</ul>

<h2>Step 4: Launch settings</h2>
<ul>
  <li><strong>Go live now:</strong> The drop page is publicly accessible immediately</li>
  <li><strong>Schedule:</strong> Set a future date and time. The page shows a countdown until then.</li>
  <li><strong>Countdown:</strong> Shows a live timer on the drop page when enabled</li>
</ul>

<h2>Step 5: Audience</h2>
<p>Enable Waitlist to collect fan signups before the drop goes live. You can also enable WhatsApp opt-in for fans who want a launch notification by WhatsApp.</p>

<h2>Step 6: Publish</h2>
<p>Review all your settings and click <strong>Publish</strong>. Your drop is now live (or scheduled). The ShareSheet gives you ready-to-use copy for social posts, WhatsApp, and countdown announcements.</p>
`,
  },

  {
    slug: "scheduled-drops",
    title: "How Scheduled Drops Work",
    excerpt: "Understand how to schedule a drop for a future date and what happens when the countdown ends.",
    category: "drops",
    tags: ["drops", "scheduled", "countdown", "launch"],
    relatedSlugs: ["launch-a-drop", "waitlist-collection"],
    status: "published",
    body: `
<h2>What is a scheduled drop?</h2>
<p>A scheduled drop is a drop that's set to go live at a specific date and time in the future. The drop page is publicly accessible but shows a countdown timer instead of the buy button until the launch moment.</p>

<h2>Setting up a scheduled drop</h2>
<ol>
  <li>In the Drop Builder, go to <strong>Step 4: Launch</strong></li>
  <li>Select <strong>Schedule</strong> instead of "Go live now"</li>
  <li>Pick your launch date and time (your local timezone)</li>
  <li>Optionally enable <strong>Countdown</strong> — shows a live Days:Hours:Minutes:Seconds timer on the drop page</li>
</ol>

<h2>What the drop page looks like before launch</h2>
<p>Before launch time, visitors to your drop page will see:</p>
<ul>
  <li>A "Coming soon" badge</li>
  <li>The countdown timer (if enabled)</li>
  <li>The waitlist form (if enabled)</li>
  <li>A preview of the products (visible but not purchasable)</li>
</ul>

<h2>What happens at launch time</h2>
<p>At the scheduled time:</p>
<ul>
  <li>The countdown flips to "Live now" with a pulsing green indicator</li>
  <li>The buy button appears on each product</li>
  <li>The status changes to "Live" in your dashboard</li>
  <li>If you had a waitlist, those signups are now your first buyers</li>
</ul>

<h2>Changing a scheduled time</h2>
<p>Click <strong>Edit</strong> on the drop card in your Drops tab, adjust the launch time in Step 4, and save. Changes take effect immediately.</p>

<h2>Going live manually before the scheduled time</h2>
<p>Click the play button (▶) on the drop card in your Drops tab. This overrides the schedule and makes the drop live immediately.</p>
`,
  },

  {
    slug: "waitlist-collection",
    title: "How Waitlist Collection Works",
    excerpt: "Learn how to collect fan signups before a drop launches and how to view and export the list.",
    category: "drops",
    tags: ["waitlist", "signups", "email", "fans"],
    relatedSlugs: ["scheduled-drops", "launch-a-drop"],
    status: "published",
    body: `
<h2>Overview</h2>
<p>The waitlist feature lets fans sign up to be notified when a drop goes live. It works for both scheduled and pre-launch drops.</p>

<h2>Enabling the waitlist</h2>
<ol>
  <li>In the Drop Builder, go to <strong>Step 5: Audience</strong></li>
  <li>Toggle <strong>Enable Waitlist</strong></li>
  <li>Optionally enable <strong>WhatsApp opt-in</strong> — fans can provide their number to receive a WhatsApp notification at launch</li>
  <li>Set a custom CTA message for the signup form (or use the default)</li>
</ol>

<h2>What fans see on the drop page</h2>
<p>Before the drop goes live, an amber signup card appears on the drop page with your CTA message, an email field, and optionally a WhatsApp field.</p>

<h2>Viewing your signups</h2>
<p>In the <strong>Drops tab</strong>, click the <strong>Waitlist badge</strong> on any drop card. A panel slides open showing:</p>
<ul>
  <li>Every signup with their email and sign-up date</li>
  <li>WhatsApp indicator for fans who opted in</li>
  <li>A <strong>Copy all emails</strong> button to export the list for your email tool</li>
</ul>

<h2>What waitlist data is stored</h2>
<ul>
  <li>Email address (required)</li>
  <li>WhatsApp number (optional, only if fan opts in)</li>
  <li>Timestamp of signup</li>
  <li>WhatsApp consent flag</li>
</ul>
<p>Halftone stores this data securely. You own it — we never send marketing to your fans without your instruction.</p>

<h2>Duplicate signups</h2>
<p>Each email can only sign up once per drop. If a fan submits the same email twice, the second submission is ignored silently.</p>

<h2>After the drop launches</h2>
<p>Waitlist data remains in your dashboard even after the drop goes live. Use it to follow up with fans who signed up but didn't purchase.</p>
`,
  },

  {
    slug: "organizations-and-stores",
    title: "How Organisations and Stores Work",
    excerpt: "Understand the difference between organisations and stores, and how to use them for labels and multi-artist setups.",
    category: "stores-orgs",
    tags: ["organisations", "stores", "labels", "multi-artist"],
    relatedSlugs: ["create-your-first-product", "launch-a-drop"],
    status: "published",
    body: `
<h2>The structure</h2>
<pre><code>Your account (personal)
  └── Store (your default store)

Organisation (a label, festival, or management company)
  └── Store (Artist A)
  └── Store (Artist B)
  └── Store (Artist C)</code></pre>

<h2>What is a Store?</h2>
<p>A store is a public-facing page where fans can browse your products and drops. Every store has:</p>
<ul>
  <li>A unique URL: <code>/store/yourhandle</code></li>
  <li>Its own product catalogue</li>
  <li>Its own drops</li>
  <li>A custom name, description, and Instagram link</li>
</ul>

<h2>What is an Organisation?</h2>
<p>An organisation is a workspace for groups managing multiple stores — typically labels, management companies, or festival teams. An org can:</p>
<ul>
  <li>Link multiple stores</li>
  <li>Invite team members with roles</li>
  <li>View aggregate revenue and orders across all stores</li>
  <li>Manage drops across all linked stores</li>
</ul>

<h2>Creating an Organisation</h2>
<ol>
  <li>In your dashboard, click the workspace switcher at the top of the sidebar</li>
  <li>Click <strong>Create organisation</strong></li>
  <li>Enter your org name, slug (URL identifier), and optional description</li>
  <li>Click Create</li>
</ol>

<h2>Linking stores to an Org</h2>
<ol>
  <li>Switch to your org workspace</li>
  <li>Click <strong>Manage org</strong> → <strong>Stores</strong> tab</li>
  <li>Enter the store handle you want to link</li>
  <li>The store owner must be a member of the org</li>
</ol>

<h2>Inviting team members</h2>
<ol>
  <li>Go to Org Settings → Members</li>
  <li>Enter the email address of the person you want to invite</li>
  <li>Select their role (Owner or Member)</li>
  <li>They'll receive an invite and can accept from their account</li>
</ol>
`,
  },

  {
    slug: "payouts-tracking",
    title: "How Payouts Are Tracked",
    excerpt: "Understand how your revenue is calculated, when you get paid, and how to read your payout stats.",
    category: "payouts",
    tags: ["payouts", "revenue", "bank", "earnings"],
    relatedSlugs: ["organizations-and-stores"],
    status: "published",
    body: `
<h2>How revenue is calculated</h2>
<p>For every order placed in your store:</p>
<ol>
  <li>The customer pays the retail price you set</li>
  <li>Halftone deducts the production and fulfilment cost</li>
  <li>The remainder is your margin — your revenue</li>
</ol>
<p>You can see a breakdown of every order from your dashboard.</p>

<h2>Payout schedule</h2>
<p>Payouts are processed on the 15th of each month for all orders fulfilled in the previous period. If the 15th falls on a weekend or public holiday, the payout is processed the next business day.</p>

<h2>Viewing your payout stats</h2>
<p>Go to <strong>Dashboard → Stores</strong>. You'll see a payout banner showing:</p>
<ul>
  <li><strong>Total earned:</strong> Cumulative revenue since you started</li>
  <li><strong>Pending payout:</strong> Revenue earned but not yet paid out</li>
  <li><strong>Next payout date:</strong> When your pending amount will be transferred</li>
</ul>

<h2>Adding your bank account</h2>
<ol>
  <li>Go to <strong>Account Settings</strong></li>
  <li>Scroll to <strong>Bank Account Details</strong></li>
  <li>Enter your account holder name, account number, IFSC code, and bank name</li>
  <li>Click Save — this will be used for all future payouts</li>
</ol>
<p><strong>Note:</strong> Your account number is masked after saving for security. Only the last 4 digits are visible.</p>

<h2>Minimum payout threshold</h2>
<p>Payouts are processed when your pending balance exceeds ₹500. If your balance is below this, it rolls over to the next payout cycle.</p>

<h2>GST and taxes</h2>
<p>Halftone issues a tax invoice for each fulfilled order. Your invoices are available in the <strong>Invoices</strong> tab of your dashboard. Consult your accountant regarding GST obligations for your business structure.</p>
`,
  },

  {
    slug: "order-sync-fulfillment-issues",
    title: "Common Order & Fulfilment Issues",
    excerpt: "Troubleshoot the most common order problems — missing print files, sync delays, and status issues.",
    category: "troubleshooting",
    tags: ["orders", "fulfilment", "troubleshooting", "sync", "print files"],
    relatedSlugs: ["payouts-tracking", "create-your-first-product"],
    status: "published",
    body: `
<h2>Print files not showing on order</h2>
<p><strong>Symptom:</strong> Order is placed but the production team can't see the print file.</p>
<p><strong>Cause:</strong> The design was saved without a print-ready file, or the product was added without going through Studio.</p>
<p><strong>Fix:</strong></p>
<ol>
  <li>Go to Studio and open the design associated with the order</li>
  <li>Re-save the design — this re-generates the print file attachment</li>
  <li>The order should now show the print file in production view</li>
</ol>

<h2>Mockup not showing on order</h2>
<p><strong>Symptom:</strong> Order shows but no mockup image is visible.</p>
<p><strong>Cause:</strong> Mockup generation can take 30–60 seconds after a design is saved.</p>
<p><strong>Fix:</strong> Wait 1–2 minutes and refresh the order page. If the mockup still doesn't appear after 5 minutes, re-save the design in Studio.</p>

<h2>Order stuck in "Order Placed"</h2>
<p><strong>Symptom:</strong> Order status hasn't progressed beyond "Order Placed" after 24 hours.</p>
<p><strong>Cause:</strong> Usually a payment confirmation delay or a missing print file preventing production from starting.</p>
<p><strong>Fix:</strong></p>
<ol>
  <li>Check that the payment was confirmed (visible in order detail)</li>
  <li>Verify the print file is attached (see above)</li>
  <li>Contact Halftone support with the order reference number if the issue persists</li>
</ol>

<h2>Shopify order not syncing</h2>
<p><strong>Symptom:</strong> An order was placed in your Shopify store but doesn't appear in Halftone.</p>
<p><strong>Cause:</strong> Webhook delay, or the product SKU in Shopify doesn't match the Halftone SKU.</p>
<p><strong>Fix:</strong></p>
<ol>
  <li>Check the Shopify tab in your dashboard for sync errors</li>
  <li>Verify that the SKU on the Shopify product matches exactly (case-sensitive)</li>
  <li>Re-trigger the webhook from Shopify if needed</li>
</ol>

<h2>Wrong size or colour on order</h2>
<p><strong>Symptom:</strong> Order shows the wrong variant.</p>
<p><strong>Cause:</strong> Variant mismatch between storefront and product configuration.</p>
<p><strong>Fix:</strong> Contact support immediately with the order reference. Size/colour corrections must be made before the item enters production.</p>

<h2>Customer says they didn't receive their order</h2>
<ol>
  <li>Check the tracking number in the order detail — click to open the courier tracking page</li>
  <li>If tracking shows delivered, contact the courier with the tracking reference</li>
  <li>If tracking is stuck, contact Halftone support with the order reference number</li>
</ol>
`,
  },
];

export function getHelpArticle(slug: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((a) => a.slug === slug && a.status === "published");
}

export function getHelpByCategory(category: string): HelpArticle[] {
  return HELP_ARTICLES.filter((a) => a.category === category && a.status === "published");
}

export function searchHelp(query: string): HelpArticle[] {
  const q = query.toLowerCase();
  return HELP_ARTICLES.filter(
    (a) =>
      a.status === "published" &&
      (a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.includes(q)))
  );
}
