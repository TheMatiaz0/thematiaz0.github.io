const fs = require("fs");
const nunjucks = require("nunjucks");
const path = require('path');

module.exports = function (eleventyConfig) {
  if (!process.env.ELEVENTY_PRODUCTION) {
    eleventyConfig.setBrowserSyncConfig({ callbacks: { ready: browserSyncReady } });
  }

  eleventyConfig.setBrowserSyncConfig(
    require('./browsersync.config')('_site')
  );

  eleventyConfig.addFilter('json', function (value, spaces) {
    if (value instanceof nunjucks.runtime.SafeString) {
      value = value.toString();
    }
    const jsonString = JSON.stringify(value, null, spaces).replace(/</g, '\\u003c');
    return nunjucks.runtime.markSafe(jsonString);
  });

  eleventyConfig.addNunjucksShortcode("includeraw", function (uri) {
    var p = fs.readFileSync(path.resolve(__dirname, uri));
    var env = nunjucks.configure();
    return env.filters.safe(p.toString());
  });

  eleventyConfig.addPassthroughCopy({ "./node_modules/nunjucks/browser/nunjucks.js": "./nunjucks.js" });

  // Passthrough
  eleventyConfig.addPassthroughCopy({ "src/static": "." });

  // Watch targets
  eleventyConfig.addWatchTarget("./src/styles/");

  var pathPrefix = "";
  if (process.env.GITHUB_REPOSITORY) {
    pathPrefix = process.env.GITHUB_REPOSITORY.split('/')[1];
  }

  return {
    dir: {
      input: "src"
    },
    pathPrefix,
    markdownTemplateEngine: "njk"
  }
};

function browserSyncReady(err, bs) {
  bs.addMiddleware("*", (req, res) => {
    const content_404 = fs.readFileSync('_site/404.html');
    res.writeHead(404, { "Content-Type": "text/html; charset=ETF-8" });
    res.write(content_404);
    res.end();
  });
}