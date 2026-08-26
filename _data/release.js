// The current release. This is the only file a version bump touches — the
// download page, both JSON-LD blocks, the footer, the docs lede and the
// platform detection in js/site.js all read from here.
//
// To ship a new version: change `version`, `date` and `dateHuman`, update the
// `size` on each artifact, and add an entry to _data/changelog.js.

const version = '1.1.0';
const date = '2026-08-25';        // ISO, for JSON-LD and the sitemap
const dateHuman = '25 August 2026';

// `suffix` is appended to `Downpick-<version>` to make the release filename.
// `key` marks the four builds js/site.js can auto-detect; the zip duplicates
// have none, so they only ever appear in the full table.
const artifacts = [
  { os: 'macOS',   arch: 'Apple Silicon',      suffix: '-arm64.dmg',      size: '124 MB', key: 'mac-arm',   label: 'macOS',   detail: 'Apple Silicon · .dmg', title: 'macOS · Apple Silicon' },
  { os: 'macOS',   arch: 'Intel',              suffix: '.dmg',            size: '128 MB', key: 'mac-intel', label: 'macOS',   detail: 'Intel · .dmg',         title: 'macOS · Intel' },
  { os: 'macOS',   arch: 'zip, Apple Silicon', suffix: '-arm64-mac.zip',  size: '124 MB' },
  { os: 'macOS',   arch: 'zip, Intel',         suffix: '-mac.zip',        size: '129 MB' },
  { os: 'Windows', arch: 'x64',                suffix: '-win.zip',        size: '144 MB', key: 'win',       label: 'Windows', detail: 'x64 · .zip',           title: 'Windows · x64' },
  { os: 'Linux',   arch: 'x64',                suffix: '.AppImage',       size: '133 MB', key: 'linux',     label: 'Linux',   detail: 'AppImage · x64',       title: 'Linux · x64' }
];

// There is no Windows .exe installer: docs/releasing.md in the app repository
// explains that the nsis target can't be built on Apple Silicon, so the
// release ships Downpick-<version>-win.zip instead.

const tag = 'v' + version;
const base = 'https://github.com/downpick/downpick/releases/download/' + tag + '/';

const full = artifacts.map(function (a) {
  const file = 'Downpick-' + version + a.suffix;
  return Object.assign({}, a, { file: file, url: base + file });
});

// The shape js/site.js wants: key -> [label, detail, title, filename].
const platforms = {};
full.forEach(function (a) {
  if (a.key) platforms[a.key] = [a.label, a.detail, a.title, a.file];
});

module.exports = {
  version: version,
  date: date,
  dateHuman: dateHuman,
  tag: tag,
  base: base,
  notes: 'https://github.com/downpick/downpick/releases/tag/' + tag,
  artifacts: full,
  // Serialised into every page for js/site.js.
  client: { base: base, platforms: platforms }
};
