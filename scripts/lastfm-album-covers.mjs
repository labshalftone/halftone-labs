#!/usr/bin/env node
// Scrape album covers from a Last.fm profile's album library and bundle them into a .zip.
//
// Usage:
//   node scripts/lastfm-album-covers.mjs <username> [options]
//
// Options:
//   --pages <n>     Number of library pages to scrape (50 albums/page). Default: 1
//   --limit <n>     Stop after collecting <n> covers (across pages).
//   --size <s>      Cover size: 174s | 300x300 | 600x600 | 770x0 | 64s. Default: 300x300
//   --out <file>    Output zip path. Default: ./<username>-album-covers.zip
//   --period <p>    Library date range: overall (default) | 7day | 1month | 3month |
//                   6month | 12month
//
// Examples:
//   node scripts/lastfm-album-covers.mjs rj
//   node scripts/lastfm-album-covers.mjs someuser --pages 3 --size 600x600 --out covers.zip
//
// No external dependencies — uses Node's built-in fetch + a tiny stored-ZIP writer.

import { writeFileSync } from "node:fs";
import path from "node:path";

const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

// Known Last.fm "no cover art" placeholder image hashes — skip these.
const PLACEHOLDER_HASHES = new Set([
  "c6f59c1e5e7240a4c0d427abd71f3dbb",
  "4128a6eb29f94943c9d206c08e625904",
  "2a96cbd8b46e442fc41c2b86b821562f",
]);

const DATE_PRESET = {
  overall: null,
  "7day": "LAST_7_DAYS",
  "1month": "LAST_30_DAYS",
  "3month": "LAST_90_DAYS",
  "6month": "LAST_180_DAYS",
  "12month": "LAST_365_DAYS",
};

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    } else {
      args._.push(a);
    }
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

// Parse one library/albums page into [{artist, album, imgUrl, hash}]
function parsePage(html, size) {
  const items = [];
  // Each album row's cover lives in a `chartlist-image` cell; split on it so we
  // can grab the cover <img> and the first /music/ link per row independently.
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
    const imgUrl = img[1].replace(/\/(?:34s|64s|174s)\//, `/${size}/`);
    items.push({ artist, album, imgUrl, hash });
  }
  return items;
}

async function fetchPage(username, page, preset) {
  const url = new URL(`https://www.last.fm/user/${encodeURIComponent(username)}/library/albums`);
  url.searchParams.set("page", String(page));
  if (preset) url.searchParams.set("date_preset", preset);
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (res.status === 404) throw new Error(`Last.fm user "${username}" not found (404).`);
  if (!res.ok) throw new Error(`Failed to fetch page ${page}: HTTP ${res.status}`);
  return res.text();
}

async function downloadImage(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  return Buffer.from(await res.arrayBuffer());
}

// ---- Minimal stored (uncompressed) ZIP writer ----------------------------
// Images are already compressed, so we store them without deflate. Pure Node,
// no dependencies.
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
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0x0800, 6); // UTF-8 flag
    local.writeUInt16LE(0, 8); // store
    local.writeUInt16LE(0, 10); // time
    local.writeUInt16LE(0, 12); // date
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

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const username = args._[0];
  if (!username || args.help) {
    console.log(
      "Usage: node scripts/lastfm-album-covers.mjs <username> [--pages n] [--limit n] " +
        "[--size 300x300] [--out file.zip] [--period overall|7day|1month|3month|6month|12month]"
    );
    process.exit(username ? 0 : 1);
  }

  const pages = Math.max(1, parseInt(args.pages, 10) || 1);
  const limit = args.limit ? parseInt(args.limit, 10) : Infinity;
  const size = args.size || "300x300";
  const period = (args.period || "overall").toLowerCase();
  if (!(period in DATE_PRESET)) {
    console.error(`Invalid --period "${period}". Choose: ${Object.keys(DATE_PRESET).join(", ")}`);
    process.exit(1);
  }
  const preset = DATE_PRESET[period];
  const outPath = args.out || `${sanitize(username)}-album-covers.zip`;

  console.log(`Scraping album covers for "${username}" (pages: ${pages}, size: ${size}, period: ${period})…`);

  // Collect album metadata across pages, de-duping by image hash.
  const seen = new Set();
  const albums = [];
  for (let p = 1; p <= pages && albums.length < limit; p++) {
    process.stdout.write(`  • fetching page ${p}… `);
    const html = await fetchPage(username, p, preset);
    const found = parsePage(html, size);
    let added = 0;
    for (const a of found) {
      if (albums.length >= limit) break;
      if (seen.has(a.hash)) continue;
      seen.add(a.hash);
      albums.push(a);
      added++;
    }
    console.log(`${added} new (${albums.length} total)`);
    if (found.length === 0) break; // no more pages
  }

  if (albums.length === 0) {
    console.error("No album covers found. Is the username correct and the library public?");
    process.exit(1);
  }

  // Download covers.
  console.log(`Downloading ${albums.length} covers…`);
  const files = [];
  const usedNames = new Set();
  let done = 0;
  for (const a of albums) {
    const data = await downloadImage(a.imgUrl);
    done++;
    if (!data || data.length === 0) {
      console.log(`  ! skip (download failed): ${a.artist} — ${a.album}`);
      continue;
    }
    const ext = a.imgUrl.split(".").pop().split("?")[0].toLowerCase();
    const base = sanitize(
      `${String(files.length + 1).padStart(2, "0")} - ${a.artist ? a.artist + " - " : ""}${a.album || a.hash}`
    );
    let name = `${base}.${ext}`;
    let n = 2;
    while (usedNames.has(name.toLowerCase())) name = `${base} (${n++}).${ext}`;
    usedNames.add(name.toLowerCase());
    files.push({ name, data });
    if (done % 10 === 0 || done === albums.length) {
      process.stdout.write(`\r  • ${done}/${albums.length} downloaded`);
    }
  }
  process.stdout.write("\n");

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
