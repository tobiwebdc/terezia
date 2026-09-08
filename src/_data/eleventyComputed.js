const path = require("path");

// Malé webp URL pro JS modal (main.js čte z data-images atributu na kartě
// produktu) -- HTML transform v .eleventy.js na tohle nedosáhne, protože
// modal si obrázky vykresluje sám přes JS, ne přes <img> tagy v HTML.
const MODAL_IMG_OPTIONS = {
  widths: [100, 1600],
  formats: ["webp"],
  outputDir: "_site/img/",
  urlPath: "/img/",
};

module.exports = {
  modalImages: async (data) => {
    if (!data.images || data.images.length === 0) return [];

    const { default: Image } = await import("@11ty/eleventy-img");

    const results = [];
    for (const src of data.images) {
      const metadata = await Image(path.join("src", src), MODAL_IMG_OPTIONS);
      results.push({
        thumb: metadata.webp[0].url,
        full: metadata.webp[metadata.webp.length - 1].url,
      });
    }
    return results;
  },
};