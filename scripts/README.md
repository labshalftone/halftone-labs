# Scripts

## `lastfm-album-covers.mjs`

Collect the album covers from a Last.fm profile and bundle them into a `.zip`.
No external dependencies — Node 18+ built-in `fetch` + a tiny stored-ZIP writer.

### Two modes

| Mode     | How                                | Best for                                                   |
| -------- | ---------------------------------- | ---------------------------------------------------------- |
| **API**  | `--api-key <key>` (or `LASTFM_API_KEY` env) | **Recommended.** Large libraries (thousands of albums). Reliable. |
| **HTML** | no key — scrapes public library pages | Small/medium public libraries.                             |

Last.fm aggressively bot-blocks deep pagination of the HTML library pages
(returns HTTP `600 Temporarily Unavailable` / empty challenge pages after the
first page or two from datacenter IPs). For anything beyond ~1 page, use API
mode. Get a free key at <https://www.last.fm/api/account/create>.

### Usage

```bash
node scripts/lastfm-album-covers.mjs <username> [options]
```

| Option            | Description                                                              | Default                         |
| ----------------- | ------------------------------------------------------------------------ | ------------------------------- |
| `--api-key <key>` | Last.fm API key (enables reliable API mode).                             | `LASTFM_API_KEY` env, else HTML |
| `--all`           | API mode: fetch every page until the library is exhausted.               | off                             |
| `--pages <n>`     | Max pages. API: 1000 albums/page. HTML: ~50/page.                        | `1`                             |
| `--limit <n>`     | Stop after collecting `<n>` covers.                                      | unlimited                       |
| `--size <s>`      | Cover size: `174s`, `300x300`, `600x600`, `770x0`, `64s`.                | `300x300`                       |
| `--out <file>`    | Output zip path.                                                         | `./<username>-album-covers.zip` |
| `--period <p>`    | Date range: `overall`, `7day`, `1month`, `3month`, `6month`, `12month`.  | `overall`                       |

### Examples

```bash
# Small public library via HTML scraping
node scripts/lastfm-album-covers.mjs rj

# Entire large library via the official API
node scripts/lastfm-album-covers.mjs ronit1910 --api-key XXXX --all

# First 3000 covers, large size
node scripts/lastfm-album-covers.mjs ronit1910 --api-key XXXX --limit 3000 --size 600x600
```

Covers are de-duplicated by image hash, named `NNNN - Artist - Album.jpg`, and
the album-art placeholder image (for albums with no cover) is skipped.
