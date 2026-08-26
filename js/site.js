// Downpick website — shared page behaviour.
// Ported from the component logic in the .dc.html design sources.
(function () {
  'use strict';

  function each(selector, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
  }

  var params = new URLSearchParams(location.search);

  /* ---------- platform detection (home + download pages) ---------- */

  var RELEASE = 'https://github.com/downpick/downpick/releases/download/v1.1.0/';

  // [button label, sub-detail, download-page title, release filename]
  var PLATFORMS = {
    'mac-arm': ['macOS', 'Apple Silicon · .dmg', 'macOS · Apple Silicon', 'Downpick-1.1.0-arm64.dmg'],
    'mac-intel': ['macOS', 'Intel · .dmg', 'macOS · Intel', 'Downpick-1.1.0.dmg'],
    'win': ['Windows', 'x64 · .zip', 'Windows · x64', 'Downpick-1.1.0-win.zip'],
    'linux': ['Linux', 'AppImage · x64', 'Linux · x64', 'Downpick-1.1.0.AppImage']
  };

  function detectPlatform() {
    var ua = navigator.userAgent || '';
    if (/Windows/i.test(ua)) return 'win';
    if (/Linux/i.test(ua) && !/Android/i.test(ua)) return 'linux';
    return 'mac-arm';
  }

  function renderPlatform(platform) {
    var p = PLATFORMS[platform] || PLATFORMS['mac-arm'];
    each('[data-platform-name]', function (el) { el.textContent = p[0]; });
    each('[data-platform-detail]', function (el) { el.textContent = p[1]; });
    each('[data-platform-title]', function (el) { el.textContent = p[2]; });
    each('[data-platform-file]', function (el) { el.textContent = p[3]; });
    each('[data-platform-link]', function (el) { el.href = RELEASE + p[3]; });
  }

  // `?platform=win` forces a platform, mirroring the design's platformOverride prop.
  var platformOverride = params.get('platform');
  var platform = (platformOverride && platformOverride !== 'auto' && PLATFORMS[platformOverride])
    ? platformOverride
    : detectPlatform();
  renderPlatform(platform);

  // The UA string always claims "Intel Mac OS X", so architecture has to come
  // from client hints.
  var uad = navigator.userAgentData;
  if (platform === 'mac-arm' && !platformOverride && uad && uad.getHighEntropyValues) {
    uad.getHighEntropyValues(['architecture']).then(function (h) {
      if (h && h.architecture && !/arm/i.test(h.architecture)) renderPlatform('mac-intel');
    }).catch(function () {});
  }

  /* ---------- Cmd vs Ctrl in the docs ---------- */

  // Elements carrying data-mac/data-win hold both spellings; the markup ships
  // with the macOS one, matching the design's default state.
  // `?keys=windows` forces the other, mirroring the design's keyStyle prop.
  var keyStyle = params.get('keys');
  var isMac = keyStyle === 'mac' ? true
    : keyStyle === 'windows' ? false
    : /Mac/i.test(navigator.userAgent || '');

  if (!isMac) {
    each('[data-win]', function (el) { el.textContent = el.getAttribute('data-win'); });
  }

  /* ---------- missing-image fallback ---------- */

  each('img[data-fallback]', function (img) {
    function placeholder() {
      if (!img.parentNode) return;
      var box = document.createElement('div');
      box.className = 'img-missing';
      box.textContent = img.getAttribute('data-fallback') + ' — image not found (' + img.getAttribute('src') + ')';
      img.replaceWith(box);
    }
    img.addEventListener('error', placeholder);
    // The image may already have failed before this script ran.
    if (img.complete && img.naturalWidth === 0) placeholder();
  });
})();
