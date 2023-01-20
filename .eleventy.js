const fs = require("fs");
const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
  if (process.env.ELEVENTY_PRODUCTION) {
    eleventyConfig.addTransform("htmlmin", htmlminTransform);
  } else {
    eleventyConfig.setBrowserSyncConfig({ callbacks: { ready: browserSyncReady } });
  }

  eleventyConfig.setBrowserSyncConfig(
    require('./browsersync.config')('_site')
  );

  eleventyConfig.addFilter("has_tag", function (arr, key, value) {
    return arr.filter(item => {
      const keys = key.split('.');
      const reduce = keys.reduce((object, key) => {
        return object[key];
      }, item);
      const str = String(reduce);

      return (str.includes(value) ? item : false);
    });
  });

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
    // Add 404 http status code in request header.
    res.writeHead(404, { "Content-Type": "text/html; charset=ETF-8" });
    // Provides the 404 content without redirect.
    res.write(content_404);
    res.end();
  });
}

function htmlminTransform(content, outputPath) {
  if (outputPath.endsWith(".html")) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true
    });
    return minified;
  }
  return content;
}
