// Downpick website build.
//
// The output is plain static HTML, identical in shape to what the site shipped
// as hand-written files — Eleventy exists here to remove duplication at
// authoring time, not to add anything to the browser.
module.exports = function (eleventyConfig) {
  // Served as-is. The design-system tokens under css/tokens/ are synced from
  // the design project; nothing in the build touches them.
  eleventyConfig.addPassthroughCopy({
    'css': 'css',
    'js': 'js',
    'assets': 'assets',
    'robots.txt': 'robots.txt',
    '.nojekyll': '.nojekyll'
  });

  // Full release download URL for one artifact filename.
  eleventyConfig.addFilter('releaseUrl', function (file, release) {
    return 'https://github.com/downpick/downpick/releases/download/' +
      release.tag + '/' + file;
  });

  // The docs sidebar is a data file, and its section ids have to match the
  // sections the page actually renders. Fail the build rather than ship a
  // sidebar link that scrolls nowhere.
  eleventyConfig.addTransform('checkDocsAnchors', function (content) {
    if (!(this.page.outputPath || '').endsWith('docs.html')) return content;
    const ids = new Set([...content.matchAll(/<section id="([^"]+)"/g)].map(m => m[1]));
    const missing = require('./_data/docsNav.json').sections
      .map(s => s.id)
      .filter(id => !ids.has(id));
    if (missing.length) {
      throw new Error('docs sidebar links to missing section id(s): ' + missing.join(', '));
    }
    return content;
  });

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '../_data'
    },
    // Page bodies are HTML with Nunjucks interpolation, same as the layouts.
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
};
