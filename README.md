# downpick.github.io

The Downpick website — built with [Eleventy](https://www.11ty.dev/) and published
to GitHub Pages at <https://downpick.github.io/>.

The output is plain static HTML with no client-side framework. Eleventy is here
to remove duplication at authoring time, not to add anything to the browser.

## Running it locally

```bash
npm install
npm run dev
```

Then open <http://localhost:8000/>. The dev server rebuilds and reloads on save.
`npm run build` writes the site to `_site/` without serving it.

Two query parameters mirror the props in the design source, and are handy for
checking the other states:

- `?platform=win` — also `linux`, `mac-intel`, `mac-arm`. Forces the platform
  used by the download button and the download page's "detected on this
  machine" card.
- `?keys=windows` — also `mac`. Forces Ctrl or Cmd in the docs shortcuts.

## Layout

```
_data/release.js        the current release — see "Shipping a new version"
_data/changelog.json    one entry per release, newest first
_data/site.json         name, URLs, and the header and footer link lists
_data/features.json     the feature list inside the JSON-LD block

src/*.njk               one file per page: front matter, then the page body
src/_includes/base.njk  <head>, <body> shell, and the release data blob
src/_includes/          header.njk, footer.njk, jsonld.njk
src/sitemap.njk         builds sitemap.xml from the pages
src/src.11tydata.js     the `{version}` substitution used in front matter

css/tokens/*.css        design-system tokens, imported verbatim from the
                        Downpick design system (colors, typography, spacing, effects)
css/site.css            shared chrome: nav, footer, buttons, cards, home page
css/pages.css           styles specific to features / download / docs
js/site.js              platform detection, Cmd-vs-Ctrl key labels, image fallbacks
assets/                 icon, product screenshot, Ask AI animation

_site/                  build output — generated, not committed
```

`css/`, `js/`, `assets/`, `robots.txt` and `.nojekyll` are copied through
untouched.

## Shipping a new version

Edit **`_data/release.js`** — it is the only file a version bump touches. Change
`version`, `date` and `dateHuman`, and update the `size` on each artifact.
Filenames are built from the version, so they need no editing.

Everything downstream follows: the download table and the "detected on this
machine" card, both JSON-LD blocks, the footer line, the docs lede, the home and
features call-to-action buttons, `sitemap.xml`'s `lastmod`, and the platform
detection in `js/site.js` — which reads the data the build writes into
`window.DOWNPICK_RELEASE` rather than carrying its own copy.

Then add an entry to the top of **`_data/changelog.json`**. The newest entry
renders with separate download and release-notes links; older ones get the
combined link. Note bodies may contain inline HTML.

Note there is no Windows `.exe` installer: `docs/releasing.md` in the app
repository explains that the nsis target can't be built on Apple Silicon, so the
release ships `Downpick-<version>-win.zip` instead.

## Adding a page

Create `src/<name>.njk` with front matter:

```yaml
---
layout: base.njk
permalink: /<name>.html
title: "<Name> — Downpick"
description: "..."
pagesCss: true          # if it uses css/pages.css
sitemapPriority: "0.8"  # omit to keep the page out of sitemap.xml
navKey: <name>          # only if it is also a header nav item
---
```

`permalink` must end in `.html` — Eleventy's default pretty URLs would break
every existing link, and GitHub Pages has no redirects. `title`, `description`
and `ogDescription` support one substitution, `{version}`.

The header and footer come from `_data/site.json`, so a new page inherits them
automatically. Add it to `footerLinks` there, and to `nav` if it belongs in the
header. Every header item is a page, never a link into the middle of one;
section-level links (the homepage's `#databases` band) belong in the footer.
The page whose `navKey` matches renders as a `.nav-current` span rather than a
link. `sitemap.xml` picks the page up on its own.

## Machine-readable metadata

- `robots.txt` — allows everything, points at the sitemap.
- `sitemap.xml` — generated from every page that declares a `sitemapPriority`.
- `404.html` — GitHub Pages serves this for unknown paths. All links across the
  site are root-absolute (`/css/...`, `/docs.html`), so it works from any depth.
- **JSON-LD** — a `SoftwareApplication` block in the head of `index.html` and
  `download.html`, from `src/_includes/jsonld.njk`. It states the version,
  licence, supported systems, and feature list in a form search engines and AI
  models read directly. The version and date come from `_data/release.js`; the
  feature list is `_data/features.json`.

## Assets

`assets/screenshot.png` and `assets/ai.gif` are copies of `docs/screenshot.png`
and `docs/ai.gif` in the [app repository](https://github.com/downpick/downpick).
Re-copy them from there when the UI changes.

There are two versions of the logo, and they are not interchangeable:

- **`downpick-mark.svg`** — cropped to the glyph (104×122, transparent). Use it
  anywhere the logo sits inline on the page: the header, the footer, the closing
  call to action. Size it with CSS `height` and leave `width: auto`; the `width`
  and `height` attributes carry the intrinsic size so the aspect ratio is exact.
- **`downpick-icon.svg`** — the app icon: the same glyph centred on a 400×400
  `#0A0A0A` plate. The glyph is only 26% of that canvas, so it renders far too
  small inline. Use it only for the favicon and the apple-touch-icon, which want
  that margin.

## Publishing

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and
deploys `_site/` to Pages. This needs Settings → Pages → Source set to
**GitHub Actions** (not "Deploy from a branch").

## Editing styles

Colours, type, spacing and shadows live in `css/tokens/` and are the design
system's own values — change them there, or re-sync from the design project,
rather than hard-coding hex values in `css/site.css` or `css/pages.css`.
