const { DateTime } = require("luxon");

module.exports = async function (eleventyConfig) {
  const { eleventyImageTransformPlugin } = await import("@11ty/eleventy-img");

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

  // Iterates ALL <img> tags in the generated HTML (main product photo,
  // preview bar) and converts them to a responsive <picture> with srcset,
  // webp + jpeg fallback and lazy loading.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["webp", "jpeg"],
    widths: [400, 800, 1200],
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
      sizes: "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw",
    },
  });

  eleventyConfig.addCollection("productsKolekce", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/content/products-kolekce/*.md")
      .filter((item) => item.data.visible !== false)
      .sort((a, b) => (a.data.name || "").localeCompare(b.data.name || ""));
  });

  eleventyConfig.addCollection("productsInspirace", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/content/products-inspirace/*.md")
      .filter((item) => item.data.visible !== false)
      .sort((a, b) => (a.data.name || "").localeCompare(b.data.name || ""));
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