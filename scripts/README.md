# Scripts

## `lastfm-album-covers.mjs`

Scrape the album covers from a public Last.fm profile's album library and bundle
them into a `.zip`. No external dependencies — uses Node's built-in `fetch` and a
tiny stored-ZIP writer (works with Node 18+).

### Usage

```bash
node scripts/lastfm-album-covers.mjs <username> [options]
```

| Option            | Description                                                              | Default                       |
| ----------------- | ------------------------------------------------------------------------ | ----------------------------- |
| `--pages <n>`     | Number of library pages to scrape (~50 albums/page).                     | `1`                           |
| `--limit <n>`     | Stop after collecting `<n>` covers.                                      | unlimited                     |
| `--size <s>`      | Cover size: `174s`, `300x300`, `600x600`, `770x0`, `64s`.                | `300x300`                     |
| `--out <file>`    | Output zip path.                                                         | `./<username>-album-covers.zip` |
| `--period <p>`    | Date range: `overall`, `7day`, `1month`, `3month`, `6month`, `12month`.  | `overall`                     |

### Examples

```bash
# Top 50 covers for a user
node scripts/lastfm-album-covers.mjs rj

# 3 pages of large covers from the last 30 days, custom output
node scripts/lastfm-album-covers.mjs someuser --pages 3 --size 600x600 \
  --period 1month --out covers.zip
```

Covers are de-duplicated by image hash, named `NN - Artist - Album.jpg`, and
the album-art placeholder image (for albums with no cover) is skipped. The
profile's library must be public.
