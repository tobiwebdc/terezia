const { DateTime } = require("luxon");

// This file is part of the CORE layer and gets synced to every client repo
// via repo-file-sync-action. Do NOT put client-specific logic here — anything
// client-specific belongs in src/_data/site.json or src/content/**, which are
// excluded from the sync.
module.exports = function (eleventyConfig) {
  // Ship assets as-is (client repos add their own files under the same folder)
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

  // Products: hide anything explicitly marked visible: false, newest/A-Z first
  eleventyConfig.addCollection("products", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/content/products/*.md")
      .filter((item) => item.data.visible !== false)
      .sort((a, b) => (a.data.name || "").localeCompare(b.data.name || ""));
  });

  eleventyConfig.addCollection("pages", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/content/pages/*.md");
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "11ty.js"],
  };
};
