# Alpha Male — landing page

A single-page site for Alpha Male, a 10 mL roll-on attraction cologne for men.

**Live:** https://77tamma.github.io/alpha-male/

The whole page is one continuous scroll-driven film. Three sections pin the viewport and
drive a video's `currentTime` from scroll position, so the reader scrubs the footage rather
than watching it play. Everything is hand-written: no framework, no build step, no bundler.

---

## Before you can take an order

The buy buttons are inert until a store URL exists. This is the only thing standing between
this page and selling.

Open `site/index.html`, find the block near the top of the script, and fill it in:

```js
var BUY_URL   = '';                        // ← your Shopify (or other) checkout URL
var BUY_LINKS = { '1': '', '2': '', '3': '' };   // optional per-pack checkout links
```

`BUY_URL` alone wires all six price cards and both call-to-action buttons. `BUY_LINKS` is
optional and overrides it per pack size (1, 2 or 3 bottles) if each has its own checkout.

While `BUY_URL` is empty the cards are marked `aria-disabled`, the buttons do nothing, and
an "Online store opening shortly" line appears under the offer.

---

## Running it locally

There is no build. Any static server works — the page only needs `assets/` served
alongside `index.html`:

```bash
cd site && python -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` directly off the filesystem mostly
works, but the scrubbed videos fetch themselves as Blobs and some browsers block that over
`file://`, so use a server.

---

## Layout

```
site/
  index.html          the entire site — markup, styles and script in one file
  assets/             video, photography and the logo
.github/workflows/    deploys site/ to GitHub Pages on push to main
assets-in/            original product photography the assets were cut from
DESIGN-PACKAGE.md     the design brief this was built against
```

`site/preview.html` is a generated single-file build with every asset inlined as a data URI,
used for sharing a self-contained copy. It is regenerated, not edited, and is not tracked.

---

## How the motion works

Scroll progress is published as a CSS custom property on each section — `--k`, `--t`, `--sp`,
`--p` — and every reveal is a `clamp()` expression reading that value. There are no JavaScript
animation loops; scroll position is the only clock, so everything runs backwards correctly
when the reader scrolls up.

The scrubbed videos are fetched as Blobs before seeking. Seeking a streaming `<video>` stalls
on byte ranges the browser has not buffered, which shows up as a scrub that sticks. They are
also encoded with a short GOP (`-g 8 -keyint_min 8`) so any frame is cheap to seek to.

Below 900px the pinned tracks release and every scroll-progress reveal resolves to its final
state, because "progress through a pinned stretch" stops meaning anything once nothing is
pinned. Motion on phones comes from an IntersectionObserver instead.

---

## Editing copy

Everything is literal text in `site/index.html`. Prices appear in two places — the offer
inside the product module and the offer at the foot — and both must agree. The current set:

| Pack | Price | Per bottle | Compared against | Saving |
|---|---|---|---|---|
| 1 bottle | $22.99 | $22.99 | — | — |
| 2 bottles | $39.99 | $20.00 | $45.98 | $5.99 |
| 3 bottles | $54.99 | $18.33 | $68.97 | $13.98 |

---

## Browser support

Modern evergreen browsers. The page uses CSS custom properties, `clamp()`, `mask-image`,
`aspect-ratio` and `IntersectionObserver`. It honours `prefers-reduced-motion`: the scrub is
disabled, loops stop, and every reveal resolves to its final state.

---

## Handing this to a developer

Everything needed to continue the work is in this repo. There is no build step and no
package to install — clone it, serve `site/`, and edit `site/index.html`.

```bash
git clone https://github.com/77tamma/alpha-male.git
cd alpha-male/site && python -m http.server 8000
```

**Where things are.** `site/index.html` is the entire site — markup, styles and script in
one file, in that order. `site/assets/` holds the video and photography it references.
`assets-in/` holds the originals those were cut from, including the print label artwork.
`DESIGN-PACKAGE.md` is the brief the page was built against and explains why the copy says
what it says.

**How the page is verified.** `review/` holds the scripts used to check every claim made
about this page. They drive headless Chrome over the CDP and measure the real composited
result rather than reading the CSS back:

| Script | What it proves |
|---|---|
| `cdp.cjs` | the shared driver the rest use — connect, evaluate, screenshot, resize |
| `guarleg3.cjs` | text contrast against the *lightest pixel* behind it, sampled across the smoke loop |
| `mobaudit.cjs` | per-section phone audit: overflow, whether each scroll variable actually moves |
| `mobhidden.cjs` | finds elements sitting on screen at opacity 0 — the bug class that hid the buy box |
| `compare.cjs` | desktop vs phone element-by-element: what disappears, what changes size |
| `clicktest.cjs` | clicks a control with a real dispatched mouse event, not `.click()` |
| `build-preview.cjs` | builds the single-file `preview.html` with every asset inlined |

Start Chrome with `--remote-debugging-port=9222` first, serve the site, then run a script
with `node review/<name>.cjs`.

Two of those exist because of mistakes worth not repeating. `clicktest.cjs` dispatches a
real mouse event because a JS `.click()` ignores `pointer-events:none` — it passed on a
button no human could press. `guarleg3.cjs` swaps the `<video>` for a `<canvas>` holding the
same frame, because Chrome's screenshot API does not composite video layers, so the first
version of that test reported a false pass on every element.

**Two known gaps**, both listed at the top of this README: `BUY_URL` is empty so no button
can take an order, and the ingredient declaration and "Made in the USA" line need review
against what can actually be documented.
