// Front matter is not run through the template engine, so the head fields
// support one substitution: `{version}` becomes the current release version.
const release = require('../_data/release.js');

function withVersion(value) {
  return typeof value === 'string' ? value.split('{version}').join(release.version) : value;
}

module.exports = {
  eleventyComputed: {
    title: data => withVersion(data.title),
    description: data => withVersion(data.description),
    ogTitle: data => withVersion(data.ogTitle),
    ogDescription: data => withVersion(data.ogDescription)
  }
};
