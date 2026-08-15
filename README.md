# downpick.github.io

The Downpick website — a static site served by GitHub Pages at
<https://downpick.github.io/>.

## Layout

```
index.html          home
features.html       what Downpick does
download.html       builds for every platform
docs.html           documentation

css/tokens/*.css    design-system tokens, imported verbatim from the
                    Downpick design system (colors, typography, spacing, effects)
css/site.css        shared chrome: nav, footer, buttons, cards, home page
css/pages.css       styles specific to features / download / docs
js/site.js          platform detection, Cmd-vs-Ctrl key labels, image fallbacks
assets/             icon, product screenshot, Ask AI animation
.nojekyll           serve files as-is, no Jekyll processing
```

## Assets

`assets/screenshot.png` and `assets/ai.gif` are copies of `docs/screenshot.png`
and `docs/ai.gif` in the [app repository](https://github.com/downpick/downpick).
Re-copy them from there when the UI changes.

## Download links

`download.html` lists the six artifacts attached to the `v1.0.0` release and
links each one directly:

```
https://github.com/downpick/downpick/releases/download/v1.0.0/<filename>
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
