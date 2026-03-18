export type AcademyArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  audience: "artist" | "manager" | "label" | "festival" | "all";
  tags: string[];
  readingTime: number;
  featured?: boolean;
  heroEmoji: string;
  relatedSlugs?: string[];
  cta: { text: string; href: string };
  status: "draft" | "published";
  publishedAt: string;
  body: string; // HTML
};

export const ACADEMY_CATEGORIES = [
  { id: "getting-started",    label: "Getting Started",            icon: "🚀", description: "Everything you need to launch from zero" },
  { id: "first-drop",         label: "First Drop University",      icon: "🎯", description: "Step-by-step launch playbooks" },
  { id: "artist-playbook",    label: "Artist Merch Playbooks",     icon: "🎨", description: "Built for independent artists" },
  { id: "manager-playbook",   label: "Manager Playbooks",          icon: "🤝", description: "Scale merch across your roster" },
  { id: "label-systems",      label: "Label Merch Systems",        icon: "🏢", description: "Multi-artist infrastructure for labels" },
  { id: "festival-playbook",  label: "Festival Merch Playbooks",   icon: "🎪", description: "Event-driven merch strategy" },
  { id: "pricing-margins",    label: "Pricing, Margins & Payouts", icon: "💰", description: "Make real money from your merch" },
  { id: "hype-growth",        label: "Hype, Launch & Growth",      icon: "📣", description: "Build demand before you sell a single tee" },
  { id: "case-studies",       label: "Case Studies",               icon: "📖", description: "Real artists, real results" },
];

export const ACADEMY_AUDIENCE = [
  { id: "artist",   label: "I'm an Artist",      icon: "🎤", desc: "Solo artist or project — learn how to turn your audience into buyers" },
  { id: "manager",  label: "I'm a Manager",       icon: "🤝", desc: "Managing talent — learn how to run merch as a real revenue line" },
  { id: "label",    label: "I'm a Label",         icon: "🏢", desc: "Running a roster — set up org-level merch systems that scale" },
  { id: "festival", label: "I'm a Festival",      icon: "🎪", desc: "Events & festivals — maximise event merch revenue before, during & after" },
];

export const ACADEMY_ARTICLES: AcademyArticle[] = [
  {
    slug: "how-to-launch-your-first-merch-drop",
    title: "How to Launch Your First Merch Drop",
    excerpt: "A complete walkthrough for artists launching their first drop — from picking products to getting your first order.",
    category: "first-drop",
    audience: "artist",
    tags: ["launch", "drops", "beginners", "products"],
    readingTime: 8,
    featured: true,
    heroEmoji: "🚀",
    relatedSlugs: ["how-to-price-merch", "build-hype-before-launch", "waitlists-to-measure-demand"],
    cta: { text: "Open Drop Builder", href: "/account?tab=drops" },
    status: "published",
    publishedAt: "2025-03-01",
    body: `
<h2>Start with why, not what</h2>
<p>Most first-time merch drops fail because artists design from ego instead of from demand. Before you open the Studio, ask yourself three questions:</p>
<ul>
  <li><strong>Who is buying this?</strong> Visualise one specific fan. What do they already own? What would make them feel part of something?</li>
  <li><strong>What's the occasion?</strong> Album release, tour, a moment in your career, a cultural signal? Drops with a story sell better.</li>
  <li><strong>What's the urgency?</strong> Limited quantity, limited time, or exclusive design? Urgency drives conversion.</li>
</ul>

<h2>Choose your hero product</h2>
<p>Don't launch 12 items. Launch one or two hero products and do them exceptionally well. The most reliable first-drop products are:</p>
<ul>
  <li><strong>Oversized Tee</strong> — the universal canvas. Easy to size, wide appeal, high perceived value when printed well.</li>
  <li><strong>Heavyweight Tee</strong> — positions you as a premium product, commands ₹200–400 more than standard.</li>
  <li><strong>Hoodie</strong> — highest perceived value but also highest price point. Best for artists with a proven audience.</li>
</ul>
<p>Pick one. Make it perfect.</p>

<h2>Build the drop in Halftone Studio</h2>
<p>Once you know your product and design, go to Studio:</p>
<ol>
  <li>Select your base product (Tee, Hoodie, Cap)</li>
  <li>Choose your colourway — stick to 1–2 colours maximum for a first drop</li>
  <li>Upload your artwork as a high-resolution PNG or SVG</li>
  <li>Preview both front and back placements</li>
  <li>Save to your Designs library</li>
</ol>

<h2>Create the Drop</h2>
<p>After your design is ready, go to the Drops tab and click <strong>New Drop</strong>. The Drop Builder will walk you through:</p>
<ul>
  <li><strong>Basics</strong> — title, slug (the URL), description, and cover image</li>
  <li><strong>Products</strong> — pick the designs you just created</li>
  <li><strong>Commerce</strong> — set whether it's limited quantity, preorder, or open</li>
  <li><strong>Launch</strong> — choose between going live immediately or scheduling a date</li>
  <li><strong>Audience</strong> — turn on Waitlist to collect demand before launch</li>
</ul>

<h2>Set a schedule and build anticipation</h2>
<p>The single highest-leverage thing you can do for a first drop is <strong>not launch immediately</strong>. Set a schedule 7–14 days out. Then:</p>
<ul>
  <li>Share the link on Instagram Stories with "notify me" enabled</li>
  <li>Post the countdown on Twitter/X</li>
  <li>Send to your mailing list with the waitlist link</li>
  <li>Go live on the scheduled date with screenshots of the signup count</li>
</ul>
<p>Opening a drop with "47 people are already waiting" is infinitely more powerful than opening cold.</p>

<h2>Price it properly</h2>
<p>A common mistake is underpricing to be "accessible." This devalues your brand and eats your margin. See our <a href="/academy/how-to-price-merch">full pricing guide</a> — but as a rough guide:</p>
<ul>
  <li>Standard Tee: ₹999–₹1,499</li>
  <li>Heavyweight Tee: ₹1,299–₹1,799</li>
  <li>Hoodie: ₹1,999–₹2,799</li>
</ul>

<h2>After launch</h2>
<p>Once you're live, do these three things:</p>
<ol>
  <li><strong>Post the drop link immediately</strong> with the number of waitlist signups as social proof</li>
  <li><strong>Story countdowns</strong> for any time limit</li>
  <li><strong>Track orders in real time</strong> from your Halftone dashboard — each order is motivation to keep promoting</li>
</ol>
`,
  },

  {
    slug: "how-to-price-merch",
    title: "How Artists Should Price Merch",
    excerpt: "Stop guessing. Here's a practical framework for pricing merch that respects your brand, covers your costs, and actually makes money.",
    category: "pricing-margins",
    audience: "artist",
    tags: ["pricing", "margins", "revenue", "strategy"],
    readingTime: 6,
    featured: true,
    heroEmoji: "💰",
    relatedSlugs: ["how-to-launch-your-first-merch-drop", "preorders-vs-limited-drops"],
    cta: { text: "View your earnings", href: "/account?tab=dashboard" },
    status: "published",
    publishedAt: "2025-03-03",
    body: `
<h2>The underpricing trap</h2>
<p>Most independent artists underprice their merch. They worry about being "too expensive" for fans, so they price at cost + a tiny margin and end up making almost nothing. Here's the truth: <strong>fans don't buy merch because it's cheap. They buy it because it means something to them.</strong></p>
<p>Underpricing also signals low quality. A ₹499 tee feels like a throwaway. A ₹1,499 tee feels like something worth keeping.</p>

<h2>The pricing formula</h2>
<p>Start with this simple structure:</p>
<pre><code>Retail Price = Production Cost × 3.5 to 4.5</code></pre>
<p>Example: If your tee costs ₹350 to produce and deliver, price it at ₹1,250–₹1,575.</p>
<p>Why 3.5–4.5x? Because you need to cover:</p>
<ul>
  <li>Production cost (printing, blank garment)</li>
  <li>Shipping to customer</li>
  <li>Payment gateway fees (~2%)</li>
  <li>Returns and replacements (~2–4%)</li>
  <li>Your time, creative direction, marketing spend</li>
  <li>Actual profit (your revenue)</li>
</ul>

<h2>Category benchmarks</h2>
<table>
  <thead><tr><th>Product</th><th>Approx. cost</th><th>Recommended retail</th><th>Margin</th></tr></thead>
  <tbody>
    <tr><td>Standard Tee</td><td>₹280–350</td><td>₹999–₹1,299</td><td>~65%</td></tr>
    <tr><td>Heavyweight Tee</td><td>₹380–450</td><td>₹1,299–₹1,699</td><td>~65%</td></tr>
    <tr><td>Hoodie</td><td>₹650–800</td><td>₹1,999–₹2,799</td><td>~65%</td></tr>
    <tr><td>Cap</td><td>₹250–320</td><td>₹799–₹1,099</td><td>~65%</td></tr>
  </tbody>
</table>

<h2>When to charge more</h2>
<p>Charge a premium (20–40% above standard) when:</p>
<ul>
  <li>It's a <strong>limited drop</strong> — scarcity justifies price</li>
  <li>It has <strong>special print technique</strong> — puff print, embroidery, screen print</li>
  <li>It's tied to <strong>a specific moment</strong> — tour exclusive, album release, collab</li>
  <li>It's <strong>a premium blank</strong> — heavyweight 280gsm, washed/distressed</li>
</ul>

<h2>Bundles</h2>
<p>Bundles increase average order value without lowering perceived quality:</p>
<ul>
  <li>Tee + Cap = save ₹200 vs buying separate (but still 3x+ margin)</li>
  <li>2 Tees = save ₹150 (rewards fans buying gifts)</li>
</ul>

<h2>What you actually keep</h2>
<p>On a ₹1,299 tee sale with Halftone:</p>
<ul>
  <li>Retail: ₹1,299</li>
  <li>Production + shipping: ~₹480</li>
  <li>Payment fees: ~₹26</li>
  <li><strong>Your margin: ~₹793 (~61%)</strong></li>
</ul>
<p>On 100 tees that's ~₹79,300. On 500 tees it's ~₹3.97L. Price is the single biggest lever you have.</p>
`,
  },

  {
    slug: "preorders-vs-limited-drops",
    title: "Pre-orders vs Limited Drops: Which Should You Use?",
    excerpt: "Two powerful models, two different strategies. Learn when to use each and how to set them up correctly.",
    category: "first-drop",
    audience: "all",
    tags: ["preorder", "limited drops", "strategy", "inventory"],
    readingTime: 5,
    featured: false,
    heroEmoji: "⚖️",
    relatedSlugs: ["how-to-launch-your-first-merch-drop", "waitlists-to-measure-demand"],
    cta: { text: "Build a Drop", href: "/account?tab=drops" },
    status: "published",
    publishedAt: "2025-03-05",
    body: `
<h2>Two models, two different purposes</h2>
<p>Both pre-orders and limited drops are about creating urgency — but they do it differently and work best in different situations.</p>

<h2>Limited Drops</h2>
<p>A limited drop means you produce a fixed quantity upfront. Once it's gone, it's gone.</p>
<p><strong>Best for:</strong></p>
<ul>
  <li>Artists with an established audience who can sell out quickly</li>
  <li>Exclusive releases tied to a moment (tour, album)</li>
  <li>Collab drops where scarcity is part of the brand story</li>
</ul>
<p><strong>Risk:</strong> You're holding inventory. If you overestimate demand, you're sitting on stock.</p>
<p><strong>How to use in Halftone:</strong> Set Limited Quantity in the Drop Builder Commerce step. The drop page will show "X remaining" to drive urgency.</p>

<h2>Pre-orders</h2>
<p>A pre-order means you collect payment (or intent) before producing. You produce only what was ordered.</p>
<p><strong>Best for:</strong></p>
<ul>
  <li>First-time drops where you don't know exact demand</li>
  <li>Custom or high-cost items where you can't risk excess stock</li>
  <li>Small or emerging artists building an audience</li>
</ul>
<p><strong>Risk:</strong> Customers wait longer. Extended fulfilment windows hurt conversion and satisfaction if not communicated clearly.</p>
<p><strong>How to use in Halftone:</strong> Enable Pre-order in the Commerce step. Set a clear expected ship date in your drop description.</p>

<h2>Hybrid: Waitlist → Limited Drop</h2>
<p>The most powerful model for most artists combines both:</p>
<ol>
  <li>Open a waitlist 1–2 weeks before launch. Collect signups.</li>
  <li>Use waitlist count to decide how many units to produce.</li>
  <li>Launch a limited drop sized to your waitlist + ~20% buffer.</li>
  <li>Announce to the waitlist first (24hr early access).</li>
  <li>Open to the public when early access ends.</li>
</ol>
<p>This gives you demand signal before you commit, scarcity on launch day, and a reason to email your most engaged fans first.</p>

<h2>Decision matrix</h2>
<table>
  <thead><tr><th>Situation</th><th>Use</th></tr></thead>
  <tbody>
    <tr><td>First drop, unknown demand</td><td>Waitlist → Pre-order</td></tr>
    <tr><td>Established artist, loyal base</td><td>Waitlist → Limited Drop</td></tr>
    <tr><td>Tour exclusive, one-night event</td><td>Limited Drop (on-site)</td></tr>
    <tr><td>Collab, hype product</td><td>Limited Drop with countdown</td></tr>
    <tr><td>Ongoing catalog item</td><td>No limit, standard drop</td></tr>
  </tbody>
</table>
`,
  },

  {
    slug: "how-labels-structure-merch",
    title: "How Labels Should Structure Merch Across Multiple Artists",
    excerpt: "Running merch for multiple artists from one label? Here's how to set up Halftone's org layer to manage everything cleanly.",
    category: "label-systems",
    audience: "label",
    tags: ["labels", "organisations", "multi-artist", "systems"],
    readingTime: 7,
    featured: true,
    heroEmoji: "🏢",
    relatedSlugs: ["how-festivals-plan-merchandise", "how-managers-run-merch"],
    cta: { text: "Set up your organisation", href: "/account?tab=dashboard" },
    status: "published",
    publishedAt: "2025-03-07",
    body: `
<h2>The core problem labels face</h2>
<p>Labels managing merch for multiple artists typically deal with:</p>
<ul>
  <li>No visibility into individual artist revenue without chasing spreadsheets</li>
  <li>Mixed inventory across artists causing fulfilment confusion</li>
  <li>Artists feeling their merch income isn't transparent</li>
  <li>No unified picture of total label merch revenue</li>
</ul>
<p>Halftone's <strong>Organisation layer</strong> is built specifically for this. Here's how to set it up.</p>

<h2>The Org → Store → Drop hierarchy</h2>
<pre><code>Organisation (your label)
  └── Store (Artist A)
       └── Drop (Artist A — Summer Release)
  └── Store (Artist B)
       └── Drop (Artist B — Tour Merch)
  └── Store (Artist C)
       └── Drop (Artist C — Collab)</code></pre>
<p>Each artist gets their own Store with their own URL (<code>/store/artistname</code>), their own drops, and their own product library. The label sees the aggregate across all stores.</p>

<h2>Setting up the Organisation</h2>
<ol>
  <li>Go to your account dashboard and click the workspace switcher at the top of the sidebar</li>
  <li>Create a new Organisation with your label name and slug</li>
  <li>Link each artist's existing store to the org from Org Settings</li>
  <li>Invite team members (A&amp;R, merch manager) with appropriate roles</li>
</ol>

<h2>Roles and permissions</h2>
<table>
  <thead><tr><th>Role</th><th>Can do</th></tr></thead>
  <tbody>
    <tr><td>Owner (you)</td><td>Everything — see all revenue, manage all stores, invite members</td></tr>
    <tr><td>Member</td><td>Manage their assigned store, see their own revenue</td></tr>
    <tr><td>Artist</td><td>Studio access, submit designs, view their store orders</td></tr>
  </tbody>
</table>

<h2>Revenue transparency</h2>
<p>The org dashboard shows:</p>
<ul>
  <li>Total label revenue across all stores</li>
  <li>Per-artist revenue bars so you can see who's selling</li>
  <li>Orders in production per store</li>
  <li>Best performer highlight</li>
</ul>
<p>Share the store-level view with artists so they can see their own earnings without seeing the full label picture.</p>

<h2>Payout structure</h2>
<p>Revenue goes to the label's registered bank account by default. For artist revenue splits:</p>
<ol>
  <li>Track each artist's store revenue separately from the org dashboard</li>
  <li>Set up your own split arrangement (Halftone doesn't enforce splits — that's between you and your artists)</li>
  <li>Use the payout stats per store to calculate what's owed</li>
</ol>

<h2>The right cadence for labels</h2>
<ul>
  <li><strong>Weekly:</strong> Check the org dashboard for active orders and pending production</li>
  <li><strong>Monthly:</strong> Review per-artist revenue, compare store performance</li>
  <li><strong>Per drop:</strong> Review waitlist signups before launch, share drop link to artist socials</li>
  <li><strong>Quarterly:</strong> Audit designs — retire underperforming products, plan the next drops</li>
</ul>
`,
  },

  {
    slug: "how-festivals-plan-merchandise",
    title: "How Festivals Should Plan Merchandise",
    excerpt: "Festival merch is one of the highest-margin revenue lines in live events. Here's how to plan it properly — before, during, and after the event.",
    category: "festival-playbook",
    audience: "festival",
    tags: ["festivals", "events", "planning", "merch strategy"],
    readingTime: 8,
    featured: false,
    heroEmoji: "🎪",
    relatedSlugs: ["preorders-vs-limited-drops", "build-hype-before-launch"],
    cta: { text: "Create your festival store", href: "/account?tab=stores" },
    status: "published",
    publishedAt: "2025-03-10",
    body: `
<h2>Merch is not an afterthought</h2>
<p>The biggest festival merch mistake is treating it as a last-minute add-on. Merch planned 6–8 weeks out generates 3–5x more revenue than merch ordered 2 weeks before the event. Here's why: you have time to build anticipation, test designs, and use waitlist data to calibrate quantities.</p>

<h2>Timeline: 8 weeks before your festival</h2>
<ul>
  <li><strong>Week 8:</strong> Decide on product mix and design brief. Commission or finalize designs.</li>
  <li><strong>Week 6:</strong> Upload designs to Halftone Studio. Create your drop. Set a schedule for launch day.</li>
  <li><strong>Week 5:</strong> Turn on Waitlist. Share the "notify me" link via email and social. Let demand signal guide your quantity decision.</li>
  <li><strong>Week 4:</strong> Review waitlist count. Place production order based on demand + 25% buffer.</li>
  <li><strong>Week 2:</strong> Go live with the drop. Email your waitlist with early access. Share on all channels.</li>
  <li><strong>Event week:</strong> Fulfil pre-event online orders. Prepare on-site inventory.</li>
  <li><strong>Post-event:</strong> Run a "last chance" window for fans who missed out.</li>
</ul>

<h2>Product mix for festivals</h2>
<p>Festival attendees want wearable cultural objects, not just branded cotton. Prioritise:</p>
<ul>
  <li><strong>Tee (primary):</strong> 50–60% of your SKU mix. 2–3 colourways maximum.</li>
  <li><strong>Hoodie:</strong> 20–25% — high margin, high perceived value, popular in cooler venues/seasons</li>
  <li><strong>Cap:</strong> 15–20% — impulse buy, easy to carry, universally wearable</li>
  <li><strong>Totebag:</strong> 10% — practical, Instagram-friendly, low cost</li>
</ul>

<h2>On-site vs online</h2>
<p>Run both in parallel:</p>
<ul>
  <li><strong>Online (Halftone):</strong> Pre-event orders delivered to fans before the festival. Fewer logistics on the day.</li>
  <li><strong>On-site (your stand):</strong> Physical stock for walk-up buyers. Use the same designs — it reinforces brand coherence.</li>
</ul>
<p>Promote the online drop heavily in the 2 weeks before the event. On-site sales convert higher when fans already recognise the design.</p>

<h2>Artist-specific vs festival-branded merchandise</h2>
<p>If your festival features headline acts, consider offering artist-specific merch alongside the festival brand. Use Halftone's org structure to create separate stores per artist but manage everything centrally.</p>

<h2>Post-event revenue window</h2>
<p>A "post-event drop" for fans who couldn't attend or missed the merch queue is a proven revenue extender. Run it for 7–10 days after the event with clear "commemorative" framing. These drops often convert at 40–60% higher rates because of FOMO from social sharing during the event.</p>
`,
  },

  {
    slug: "build-hype-before-launch",
    title: "How to Build Hype Before a Drop Launch",
    excerpt: "The drops that sell out aren't the ones with the best designs — they're the ones with the best build-up. Here's a practical pre-launch playbook.",
    category: "hype-growth",
    audience: "all",
    tags: ["hype", "social media", "launch", "marketing", "growth"],
    readingTime: 6,
    featured: true,
    heroEmoji: "📣",
    relatedSlugs: ["waitlists-to-measure-demand", "how-to-launch-your-first-merch-drop"],
    cta: { text: "Build your next drop", href: "/account?tab=drops" },
    status: "published",
    publishedAt: "2025-03-12",
    body: `
<h2>Why most drops underperform</h2>
<p>Opening a drop cold — posting a link with no prior signal — almost always underperforms. Why? Because your audience has no context, no anticipation, and no social proof. The algorithm doesn't know to show it. The fans who'd buy it weren't primed.</p>
<p>The solution isn't better design. It's better build-up.</p>

<h2>The 2-week hype window</h2>
<p>14 days before launch is your minimum build window. Here's how to fill it:</p>

<h3>Day 14–10: Tease</h3>
<ul>
  <li>Post a cropped/blurred preview of the design — don't reveal everything</li>
  <li>"Something's coming" with the drop date</li>
  <li>Share the waitlist link: "Sign up to be notified first"</li>
  <li>Don't mention the price yet — let anticipation build</li>
</ul>

<h3>Day 9–5: Reveal</h3>
<ul>
  <li>Full design reveal — high-quality flat lay or mockup</li>
  <li>Post the waitlist count: "380 people have already signed up"</li>
  <li>Explain the story: why this design, what it means, who made it</li>
  <li>Behind-the-scenes content — printing process, design evolution</li>
</ul>

<h3>Day 4–2: Countdown</h3>
<ul>
  <li>Instagram/Twitter countdown sticker to launch date</li>
  <li>"X days left to get on the waitlist for early access"</li>
  <li>Share user reactions if any (DMs, comments, replies)</li>
  <li>Final reminder: price, sizes, limited quantity if applicable</li>
</ul>

<h3>Launch day</h3>
<ul>
  <li>Email the waitlist: "Early access is live — you have 24 hours"</li>
  <li>Post the link publicly 24hrs later</li>
  <li>Share real-time order count ("17 sold in the first hour")</li>
  <li>Stories throughout the day with updates</li>
</ul>

<h2>The best content formats for drops</h2>
<ul>
  <li><strong>Mockups on real people:</strong> Nothing sells clothes like seeing them worn. Get 2–3 people in your community to shoot content.</li>
  <li><strong>Process videos:</strong> Time-lapses of printing, screen printing, embroidery — these massively over-perform on Reels/TikTok</li>
  <li><strong>Waitlist count updates:</strong> "247 people waiting" is social proof. Post it.</li>
  <li><strong>Countdown posts:</strong> Simple, repeated. "3 days." "2 days." "Tomorrow."</li>
</ul>

<h2>Generating captions fast</h2>
<p>The Halftone Drop Builder generates ready-to-copy captions for your launch posts and countdown announcements in the Publish step. Use them as a starting point and personalise.</p>

<h2>Channels by audience</h2>
<table>
  <thead><tr><th>Channel</th><th>Best for</th><th>Content type</th></tr></thead>
  <tbody>
    <tr><td>Instagram</td><td>Visual reveal, countdown</td><td>Reels, Stories, Carousels</td></tr>
    <tr><td>Twitter/X</td><td>Real-time updates, count</td><td>Text threads, images</td></tr>
    <tr><td>WhatsApp</td><td>Tight fan community</td><td>Direct message blast</td></tr>
    <tr><td>Email</td><td>Waitlist → early access</td><td>Plain text, link</td></tr>
    <tr><td>TikTok</td><td>Process videos, reveals</td><td>Short-form video</td></tr>
  </tbody>
</table>
`,
  },

  {
    slug: "waitlists-to-measure-demand",
    title: "How to Use Waitlists to Measure Demand Before Launch",
    excerpt: "A waitlist isn't just a contact list — it's your most accurate demand signal. Here's how to read it and act on it.",
    category: "hype-growth",
    audience: "all",
    tags: ["waitlist", "demand", "strategy", "launch"],
    readingTime: 5,
    featured: false,
    heroEmoji: "📋",
    relatedSlugs: ["build-hype-before-launch", "preorders-vs-limited-drops"],
    cta: { text: "Enable waitlist on your drop", href: "/account?tab=drops" },
    status: "published",
    publishedAt: "2025-03-14",
    body: `
<h2>Why waitlists are underused</h2>
<p>Most artists use waitlists the wrong way — they collect emails and then don't look at the data until after launch. That wastes the most valuable thing a waitlist gives you: <strong>a decision-making signal before you commit.</strong></p>

<h2>What your waitlist count tells you</h2>
<table>
  <thead><tr><th>Signups</th><th>What it means</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td>&lt; 50</td><td>Demand is limited or build-up was insufficient</td><td>Delay launch, increase marketing, reconsider quantity</td></tr>
    <tr><td>50–200</td><td>Good starting signal for a first drop</td><td>Produce 150–300 units. Limit quantities to create scarcity.</td></tr>
    <tr><td>200–500</td><td>Strong demand. Audience is engaged.</td><td>Produce 300–600 units. Consider a waitlist-exclusive early window.</td></tr>
    <tr><td>500+</td><td>Major drop. Multiple sell-out waves possible.</td><td>Plan waves: waitlist → public → "last chance." Produce in batches.</td></tr>
  </tbody>
</table>
<p><em>Note: conversion from waitlist to purchase is typically 20–40%. Plan inventory accordingly.</em></p>

<h2>Waitlist conversion tactics</h2>
<p>Just collecting emails isn't enough. To maximise conversion:</p>
<ul>
  <li><strong>Give early access:</strong> Waitlist gets 24–48hrs before public launch. Creates real exclusivity.</li>
  <li><strong>Send a personal email:</strong> Not a newsletter blast. A direct message: "Hey, you signed up for the waitlist — it's live now." Conversion on these is 3–5x higher.</li>
  <li><strong>Show the number:</strong> Telling waitlist members "you're one of 312 people who signed up" increases urgency.</li>
  <li><strong>WhatsApp follow-up:</strong> If you collected WhatsApp opt-ins, a WhatsApp message on launch day performs extremely well for music fans.</li>
</ul>

<h2>Setting up a waitlist in Halftone</h2>
<ol>
  <li>In the Drop Builder, go to the <strong>Audience</strong> step</li>
  <li>Toggle <strong>Enable Waitlist</strong></li>
  <li>Optionally enable WhatsApp opt-in for fans who want a message notification</li>
  <li>Set a custom CTA message (e.g. "Be first to get the Keinemusik drop →")</li>
  <li>Share your drop link before going live — the waitlist form appears on the public drop page automatically</li>
</ol>

<h2>Viewing your signups</h2>
<p>In the Drops tab, click the <strong>Waitlist badge</strong> on any drop card to open the signups panel. You'll see every signup, their email, date, and WhatsApp consent status. You can copy all emails at once for your launch announcement.</p>

<h2>After the drop: close the loop</h2>
<p>Send everyone on the waitlist a post-drop message — whether they bought or not. For buyers: thank them and give an ETA. For non-buyers: let them know if there's a second wave or what's next. This keeps your list warm for the next drop.</p>
`,
  },
];

export function getArticle(slug: string): AcademyArticle | undefined {
  return ACADEMY_ARTICLES.find((a) => a.slug === slug && a.status === "published");
}

export function getArticlesByCategory(category: string): AcademyArticle[] {
  return ACADEMY_ARTICLES.filter((a) => a.category === category && a.status === "published");
}

export function getArticlesByAudience(audience: string): AcademyArticle[] {
  return ACADEMY_ARTICLES.filter((a) => (a.audience === audience || a.audience === "all") && a.status === "published");
}

export function getFeaturedArticles(): AcademyArticle[] {
  return ACADEMY_ARTICLES.filter((a) => a.featured && a.status === "published");
}
