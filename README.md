# downpick.github.io

The Downpick website — a static site served by GitHub Pages at
<https://downpick.github.io/>.

## Layout

```
index.html          home
features.html       what Downpick does
docs.html           documentation
changelog.html      release notes
download.html       builds for every platform

css/tokens/*.css    design-system tokens, imported verbatim from the
                    Downpick design system (colors, typography, spacing, effects)
css/site.css        shared chrome: nav, footer, buttons, cards, home page
css/pages.css       styles specific to features / download / docs
js/site.js          platform detection, Cmd-vs-Ctrl key labels, image fallbacks
assets/             icon, product screenshot, Ask AI animation
.nojekyll           serve files as-is, no Jekyll processing
```

## Machine-readable metadata

- `robots.txt` — allows everything, points at the sitemap.
- `sitemap.xml` — **add every new page here**, and bump `lastmod`.
- `404.html` — GitHub Pages serves this for unknown paths. It uses root-absolute
  paths (`/css/...`) because it can be served from any depth.
- **JSON-LD** — a `SoftwareApplication` block in the head of `index.html` and
  `download.html`. It states the version, licence, supported systems, and
  feature list in a form search engines and AI models read directly, so
  **`softwareVersion` and `datePublished` need bumping with each release**,
  alongside the download URLs above.

## Navigation

Every item in the header is a page, never a link into the middle of another
page: `Features · Docs · What's new · GitHub · [Download]`. The current page
renders as a `.nav-current` span instead of a link. The header and the footer
link list are identical on all five pages — keep them that way when adding a
page, and add the new page to the footer list too.

Section-level links (the homepage's `#databases` band) belong in the footer, not
the header.

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

## Download links

`download.html` lists the six artifacts attached to the `v1.1.0` release and
links each one directly:

```
https://github.com/downpick/downpick/releases/download/v1.1.0/<filename>
```

The same base URL is in `js/site.js` as `RELEASE`, which builds the link for the
"detected on this machine" card. **Both need bumping when a new version ships** —
along with the version strings in the page copy and the file sizes in the table.

Note there is no Windows `.exe` installer: `docs/releasing.md` in the app
repository explains that the nsis target can't be built on Apple Silicon, so the
release ships `Downpick-<version>-win.zip` instead.

## Running it locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

Two query parameters mirror the props in the design source, and are handy for
checking the other states:

- `?platform=win` — also `linux`, `mac-intel`, `mac-arm`. Forces the platform
  used by the download button and the download page's "detected on this
  machine" card.
- `?keys=windows` — also `mac`. Forces Ctrl or Cmd in the docs shortcuts.

## Publishing

Settings → Pages → Deploy from a branch → `main` / root. Pushing to `main`
publishes.

## Editing

Colours, type, spacing and shadows live in `css/tokens/` and are the design
system's own values — change them there, or re-sync from the design project,
rather than hard-coding hex values in `css/site.css` or `css/pages.css`.
