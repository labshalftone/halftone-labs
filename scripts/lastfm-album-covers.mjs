#!/usr/bin/env node
// Scrape album covers from a Last.fm profile and bundle them into a .zip.
//
// Two modes:
//   • API mode  (recommended) — pass --api-key. Uses the official Last.fm API
//     (user.getTopAlbums). Reliable for large libraries (thousands of albums),
//     not subject to the anti-bot blocking that throttles HTML pages.
//     Get a free key at https://www.last.fm/api/account/create
//     (or set the LASTFM_API_KEY env var).
//   • HTML mode (fallback) — no key needed, scrapes the public library pages.
//     Fine for small/medium public libraries; Last.fm bot-blocks deep
//     pagination, so very large libraries will stall after a few pages.
//
// Usage:
//   node scripts/lastfm-album-covers.mjs <username> [options]
//
// Options:
//   --api-key <key> Last.fm API key (enables reliable API mode).
//   --pages <n>     Max pages to fetch. API: 1000 albums/page. HTML: 50/page. Default: 1
//   --limit <n>     Stop after collecting <n> covers.
//   --size <s>      Cover size: 174s | 300x300 | 600x600 | 770x0 | 64s. Default: 300x300
//   --out <file>    Output zip path. Default: ./<username>-album-covers.zip
//   --period <p>    Date range: overall (default) | 7day | 1month | 3month | 6month | 12month
//   --all           Fetch every page (API mode) until the library is exhausted.
//
// Examples:
//   node scripts/lastfm-album-covers.mjs rj
//   node scripts/lastfm-album-covers.mjs ronit1910 --api-key XXXX --all --size 300x300
//   node scripts/lastfm-album-covers.mjs ronit1910 --api-key XXXX --limit 3000
//
// No external dependencies — Node 18+ built-in fetch + a tiny stored-ZIP writer.

import { writeFileSync } from "node:fs";
import path from "node:path";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

// Known Last.fm "no cover art" placeholder image hashes — skip these.
const PLACEHOLDER_HASHES = new Set([
  "c6f59c1e5e7240a4c0d427abd71f3dbb",
  "4128a6eb29f94943c9d206c08e625904",
  "2a96cbd8b46e442fc41c2b86b821562f",
]);

// HTML library date_preset values.
const DATE_PRESET = {
  overall: null,
  "7day": "LAST_7_DAYS",
  "1month": "LAST_30_DAYS",
  "3month": "LAST_90_DAYS",
  "6month": "LAST_180_DAYS",
  "12month": "LAST_365_DAYS",
};
// API period values (user.getTopAlbums).
const API_PERIOD = {
  overall: "overall",
  "7day": "7day",
  "1month": "1month",
  "3month": "3month",
  "6month": "6month",
  "12month": "12month",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseArgs(argv) {
  const args = { _: [] };
  const flags = new Set(["all", "help"]);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      if (flags.has(key)) {
        args[key] = true;
      } else {
        const next = argv[i + 1];
        if (next === undefined || next.startsWith("--")) args[key] = true;
        else {
          args[key] = next;
          i++;
        }
      }
    } else args._.push(a);
  }
  return args;
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function sanitize(name) {
  return name
    .replace(/[\/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function upscale(url, size) {
  // Rewrite any Last.fm CDN size segment (e.g. /64s/, /174s/, /300x300/) to the wanted one.
  return url.replace(/\/(?:\d+s|\d+x\d+|avatar\d+s)\//, `/${size}/`);
}

// ---------- API mode -------------------------------------------------------
async function fetchTopAlbumsPage(username, apiKey, page, period, perPage) {
  const url = new URL("https://ws.audioscrobbler.com/2.0/");
  url.searchParams.set("method", "user.gettopalbums");
  url.searchParams.set("user", username);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("format", "json");
  url.searchParams.set("period", period);
  url.searchParams.set("limit", String(perPage));
  url.searchParams.set("page", String(page));

  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(20000),
      });
      const json = await res.json();
      if (json.error) {
        throw new Error(`Last.fm API error ${json.error}: ${json.message}`);
      }
      const top = json.topalbums;
      const albums = (top?.album || []).map((al) => {
        const imgs = al.image || [];
        const best = imgs[imgs.length - 1]?.["#text"] || "";
        const hash = (best.match(/\/([0-9a-f]+)\.(?:jpg|png|gif)/) || [])[1] || "";
        return { artist: al.artist?.name || "", album: al.name || "", imgUrl: best, hash };
      });
      const totalPages = parseInt(top?.["@attr"]?.totalPages || "1", 10);
      const total = parseInt(top?.["@attr"]?.total || "0", 10);
      return { albums, totalPages, total };
    } catch (err) {
      if (err.message?.startsWith("Last.fm API error")) throw err; // not retryable
      if (attempt === 4) throw err;
      await sleep(attempt * 1500);
    }
  }
}

// ---------- HTML mode ------------------------------------------------------
function parseHtmlPage(html) {
  const items = [];
  const segments = html.split('chartlist-image"');
  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i].slice(0, 2000);
    const img = seg.match(
      /<img\s+src="(https:\/\/lastfm[^"]+\/(?:34s|64s|174s)\/([0-9a-f]+)\.(?:jpg|png|gif))"\s+alt="([^"]*)"/i
    );
    if (!img) continue;
    const hash = img[2];
    if (PLACEHOLDER_HASHES.has(hash)) continue;
    const album = decodeEntities(img[3] || "").trim();
    const href = seg.match(/href="\/music\/([^/"]+)\/([^"]+)"/);
    let artist = "";
    if (href) artist = decodeEntities(decodeURIComponent(href[1].replace(/\+/g, " ")));
    items.push({ artist, album, imgUrl: img[1], hash });
  }
  return items;
}

function isChallengePage(html) {
  // Bot-block / "Temporarily Unavailable" responses have no real <title> and no chartlist.
  return !/<title>[^<]*Last\.fm[^<]*<\/title>/i.test(html) || !html.includes("chartlist");
}

async function fetchHtmlPage(username, page, preset) {
  const url = new URL(`https://www.last.fm/user/${encodeURIComponent(username)}/library/albums`);
  url.searchParams.set("page", String(page));
  if (preset) url.searchParams.set("date_preset", preset);

  for (let attempt = 1; attempt <= 6; attempt++) {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9", Accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(25000),
    });
    if (res.status === 404) throw new Error(`Last.fm user "${username}" not found (404).`);
    const html = res.ok ? await res.text() : "";
    if (res.ok && !isChallengePage(html)) return { html, blocked: false };
    if (attempt < 6) await sleep(attempt * 4000); // back off through the throttle
  }
  return { html: "", blocked: true };
}

async function downloadImage(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(20000), // never hang on a dead connection
      });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 0) return buf;
      }
    } catch {
      /* timeout or network error — retry */
    }
    await sleep(attempt * 600);
  }
  return null;
}

// Run async tasks with bounded concurrency, preserving input order in results.
async function mapPool(items, concurrency, worker, onProgress) {
  const results = new Array(items.length);
  let next = 0;
  let completed = 0;
  async function run() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
      completed++;
      if (onProgress) onProgress(completed, items.length);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

// ---------- Minimal stored (uncompressed) ZIP writer -----------------------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function buildZip(files) {
  const chunks = [];
  const central = [];
  let offset = 0;
  for (const f of files) {
    const nameBuf = Buffer.from(f.name, "utf8");
    const data = f.data;
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(0, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    chunks.push(local, nameBuf, data);
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0x0800, 8);
    cd.writeUInt16LE(0, 10);
    cd.writeUInt16LE(0, 12);
    cd.writeUInt16LE(0, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(data.length, 20);
    cd.writeUInt32LE(data.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34);
    cd.writeUInt16LE(0, 36);
    cd.writeUInt32LE(0, 38);
    cd.writeUInt32LE(offset, 42);
    central.push(Buffer.concat([cd, nameBuf]));
    offset += local.length + nameBuf.length + data.length;
  }
  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...chunks, centralBuf, end]);
}
// --------------------------------------------------------------------------

async function collectViaApi(username, apiKey, { pages, all, limit, period }) {
  const apiPeriod = API_PERIOD[period];
  const perPage = 1000;
  const seen = new Set();
  const albums = [];
  const first = await fetchTopAlbumsPage(username, apiKey, 1, apiPeriod, perPage);
  const totalPages = all ? first.totalPages : Math.min(pages, first.totalPages);
  console.log(`  library has ${first.total} albums across ${first.totalPages} API page(s).`);
  const pushAll = (list) => {
    for (const a of list) {
      if (albums.length >= limit) break;
      if (!a.imgUrl || !a.hash || PLACEHOLDER_HASHES.has(a.hash) || seen.has(a.hash)) continue;
      seen.add(a.hash);
      albums.push(a);
    }
  };
  pushAll(first.albums);
  for (let p = 2; p <= totalPages && albums.length < limit; p++) {
    process.stdout.write(`\r  • fetched page ${p}/${totalPages} (${albums.length} covers)`);
    const { albums: list } = await fetchTopAlbumsPage(username, apiKey, p, apiPeriod, perPage);
    pushAll(list);
  }
  process.stdout.write("\n");
  return albums;
}

async function collectViaHtml(username, { pages, limit, period }) {
  const preset = DATE_PRESET[period];
  const seen = new Set();
  const albums = [];
  for (let p = 1; p <= pages && albums.length < limit; p++) {
    process.stdout.write(`  • fetching page ${p}… `);
    const { html, blocked } = await fetchHtmlPage(username, p, preset);
    if (blocked) {
      console.log("blocked by Last.fm anti-bot (try API mode with --api-key).");
      break;
    }
    const found = parseHtmlPage(html);
    let added = 0;
    for (const a of found) {
      if (albums.length >= limit) break;
      if (seen.has(a.hash)) continue;
      seen.add(a.hash);
      albums.push(a);
      added++;
    }
    console.log(`${added} new (${albums.length} total)`);
    if (found.length === 0) break; // genuine end of library
  }
  return albums;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const username = args._[0];
  if (!username || args.help) {
    console.log(
      "Usage: node scripts/lastfm-album-covers.mjs <username> [--api-key key] [--all] " +
        "[--pages n] [--limit n] [--size 300x300] [--out file.zip] " +
        "[--period overall|7day|1month|3month|6month|12month]"
    );
    process.exit(username ? 0 : 1);
  }

  const apiKey = args["api-key"] || process.env.LASTFM_API_KEY || null;
  const pages = Math.max(1, parseInt(args.pages, 10) || 1);
  const all = !!args.all;
  const limit = args.limit ? parseInt(args.limit, 10) : Infinity;
  const size = args.size || "300x300";
  const period = (args.period || "overall").toLowerCase();
  if (!(period in DATE_PRESET)) {
    console.error(`Invalid --period "${period}". Choose: ${Object.keys(DATE_PRESET).join(", ")}`);
    process.exit(1);
  }
  const outPath = args.out || `${sanitize(username)}-album-covers.zip`;
  const mode = apiKey ? "API" : "HTML";

  console.log(
    `Collecting album covers for "${username}" — ${mode} mode (size: ${size}, period: ${period})…`
  );

  let albums;
  if (apiKey) albums = await collectViaApi(username, apiKey, { pages, all, limit, period });
  else albums = await collectViaHtml(username, { pages, limit, period });

  if (!albums || albums.length === 0) {
    console.error(
      "No album covers collected. Check the username/library is public, or use --api-key."
    );
    process.exit(1);
  }

  console.log(`Downloading ${albums.length} covers (16 at a time)…`);
  const downloaded = await mapPool(
    albums,
    16,
    (a) => downloadImage(upscale(a.imgUrl, size)),
    (done, total) => {
      if (done % 25 === 0 || done === total) {
        process.stdout.write(`\r  • ${done}/${total} downloaded`);
      }
    }
  );
  process.stdout.write("\n");

  // Assemble in library order, skipping failures and de-duping filenames.
  const files = [];
  const usedNames = new Set();
  albums.forEach((a, i) => {
    const data = downloaded[i];
    if (!data) return;
    const ext = (a.imgUrl.split(".").pop() || "jpg").split("?")[0].toLowerCase();
    const base = sanitize(
      `${String(files.length + 1).padStart(4, "0")} - ${a.artist ? a.artist + " - " : ""}${
        a.album || a.hash
      }`
    );
    let name = `${base}.${ext}`;
    let n = 2;
    while (usedNames.has(name.toLowerCase())) name = `${base} (${n++}).${ext}`;
    usedNames.add(name.toLowerCase());
    files.push({ name, data });
  });

  if (files.length === 0) {
    console.error("All downloads failed — nothing to zip.");
    process.exit(1);
  }

  const zip = buildZip(files);
  writeFileSync(outPath, zip);
  const mb = (zip.length / (1024 * 1024)).toFixed(2);
  console.log(`✓ Wrote ${files.length} covers to ${path.resolve(outPath)} (${mb} MB)`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
