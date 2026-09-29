// Current release metadata, shared by downloads, JSON-LD, the footer,
// the docs lede, and platform detection in js/site.js.
//
// To ship a new version: change `version`, `date` and `dateHuman`, update the
// artifact list, and add an entry to _data/changelog.json. See README.md
// for the accompanying feature and documentation updates.

const version = '1.4.0';
const date = '2026-09-29';        // ISO, for JSON-LD and the sitemap
const dateHuman = '29 September 2026';

// `suffix` is appended to `Downpick-<version>` to make the release filename;
// `prefix` is used by the Windows NSIS installer. `key` marks the four builds
// js/site.js can auto-detect; the zip duplicates have none, so they only ever
// appear in the full table.
const artifacts = [
  { os: 'macOS',   arch: 'Apple Silicon',      suffix: '-arm64.dmg',     key: 'mac-arm',   label: 'macOS',   detail: 'Apple Silicon · .dmg', title: 'macOS · Apple Silicon' },
  { os: 'macOS',   arch: 'Intel',              suffix: '.dmg',           key: 'mac-intel', label: 'macOS',   detail: 'Intel · .dmg',         title: 'macOS · Intel' },
  { os: 'macOS',   arch: 'zip, Apple Silicon', suffix: '-arm64-mac.zip' },
  { os: 'macOS',   arch: 'zip, Intel',         suffix: '-mac.zip' },
  { os: 'Windows', arch: 'x64 installer',     prefix: 'Downpick.Setup.', suffix: '.exe', key: 'win', label: 'Windows', detail: 'x64 · .exe installer', title: 'Windows · x64' },
  { os: 'Linux',   arch: 'x64',                suffix: '.AppImage',      key: 'linux',     label: 'Linux',   detail: 'AppImage · x64',       title: 'Linux · x64' }
];

// Windows releases use the NSIS installer. Portable/older ZIP builds are not
// part of this release because automatic updates require an installed build.

const tag = 'v' + version;
const base = 'https://github.com/downpick/downpick/releases/download/' + tag + '/';

const full = artifacts.map(function (a) {
  const file = (a.prefix ? a.prefix + version : 'Downpick-' + version) + a.suffix;
  return Object.assign({}, a, { file: file, url: base + encodeURIComponent(file) });
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
