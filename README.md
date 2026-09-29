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
_data/docsNav.json      the docs sidebar
_data/settings.json     the docs Settings tables
_data/shortcuts.json    the docs keyboard shortcuts table
_data/files.json        the docs "where files live" table

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

Start from the **published GitHub release and its exact tag** in
[downpick/downpick](https://github.com/downpick/downpick/releases). Compare it
with the version currently in `_data/release.js`; use the tagged source to
confirm labels, defaults, engine support, and limitations.

Edit **`_data/release.js`** for the release metadata: `version`, `date` and
`dateHuman` (the publication date), and the artifact list. Check every generated
filename against the release API's asset names and download URLs. Filenames are
built from the version, except for the Windows NSIS installer's `prefix`.

Everything downstream follows: the download table and the "detected on this
machine" card, both JSON-LD blocks, the footer line, the docs lede, the home and
features call-to-action buttons, `sitemap.xml`'s `lastmod`, and the platform
detection in `js/site.js` — which reads the data the build writes into
`window.DOWNPICK_RELEASE` rather than carrying its own copy.

Then add an entry to the top of **`_data/changelog.json`**. The newest entry
renders with separate download and release-notes links; older ones get the
combined link. Note bodies may contain inline HTML.

Update the user-facing content too: **`src/index.njk`**, **`src/features.njk`**,
**`src/docs.njk`**, and the relevant data files (especially features, settings,
and docs navigation). Keep existing changelog entries. Verify signing and
updater behavior for the actual build before changing installation guidance.

Windows releases use the NSIS installer. For 1.4.0, GitHub publishes it as
`Downpick.Setup.1.4.0.exe`, even though the build and release prose use spaces.
Use the uploaded asset name, not a guessed filename. The updater requires an
installed build; portable or unsupported distributions fall back to downloads.

Run `npm run build`, check internal links and anchors in `_site/`, and inspect
the home, features, docs, changelog, and download pages at desktop and narrow
widths. Check download detection with all four `?platform=` values above. Do
not commit `_site/`.

The reusable Codex skill is **`$downpick-site-update`** when installed in your
Codex skills directory. Example: “Use $downpick-site-update to update this site
for Downpick 1.5.0 and give me the publishing steps.”

## Editing the docs

The prose in `src/docs.njk` is plain HTML. The repeating tables are data:

- **`_data/shortcuts.json`** — one entry per row: `keys` is the macOS spelling,
  `win` the Windows one, and `action` the description. Omit `win` when the
  shortcut is the same on both, and no `data-mac`/`data-win` attributes are
  written for that row.
- **`_data/settings.json`** — the Settings sections, in order. Each has a
  `group` heading and its `rows` of `name`, `meta` and `body`.
- **`_data/files.json`** — the "where files live" rows: `path` and `body`.
- **`_data/docsNav.json`** — the sidebar. `sections` must match the
  `<section id="...">` ids in `src/docs.njk`; the build fails with
  `docs sidebar links to missing section id(s): ...` if one doesn't, so a
  sidebar link can never scroll nowhere.

`body` and `action` fields may contain inline HTML — `<span class="mono">`,
links, and so on.

The numbered `numstep` blocks are left as HTML on purpose: each body is a full
paragraph of prose with inline markup, which reads better in the template than
as an escaped string in a data file.

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
**GitHub Actions** (not "Deploy from a branch"). This repository already uses
that setting. Pull requests run the build without deploying; a manual workflow
run on `main` also deploys.

For the 1.4.0 content update:

1. Review the changes with `git diff`, then run `npm run build`. Preview with
   `npm run dev` at <http://localhost:8000/>.
2. Create a review branch and commit the source changes:

   ```bash
   git switch -c codex/site-1.4.0
   git add README.md _data/release.js _data/changelog.json _data/features.json _data/settings.json _data/docsNav.json src/index.njk src/features.njk src/docs.njk
   git commit -m "Update website for Downpick 1.4.0"
   git push -u origin codex/site-1.4.0
   ```

3. Open a pull request into `main`, wait for the **build** check, and merge it.
   That merge triggers **Deploy to GitHub Pages**. No new app release or website
   version tag is needed.
4. Follow the run in the repository's [Actions tab](https://github.com/downpick/downpick.github.io/actions/workflows/deploy.yml).
   Both **build** and **deploy** must finish successfully.
5. Open <https://downpick.github.io/> and verify version 1.4.0, the latest
   What's new entry, the new docs sections, and the platform download links.

For future versions, replace the version in the branch and commit message and
stage the actual changed source files.

## Editing styles

Colours, type, spacing and shadows live in `css/tokens/` and are the design
system's own values — change them there, or re-sync from the design project,
rather than hard-coding hex values in `css/site.css` or `css/pages.css`.
