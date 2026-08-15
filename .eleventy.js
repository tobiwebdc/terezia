const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

  // Produkty — kolekce k prodeji (řazeno abecedně, skryté produkty ven)
  eleventyConfig.addCollection("productsKolekce", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/content/products-kolekce/*.md")
      .filter((item) => item.data.visible !== false)
      .sort((a, b) => (a.data.name || "").localeCompare(b.data.name || ""));
  });

  // Produkty — na objednání / inspirace
  eleventyConfig.addCollection("productsInspirace", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/content/products-inspirace/*.md")
      .filter((item) => item.data.visible !== false)
      .sort((a, b) => (a.data.name || "").localeCompare(b.data.name || ""));
  });

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
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
