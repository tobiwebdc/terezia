/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,html,js}"],
  safelist: [
    "border-coral/50", "hover:bg-coral/10", "text-coral",
    "border-mustard/50", "hover:bg-mustard/10", "text-mustard",
    "border-sage/50", "hover:bg-sage/10", "text-sage",
  ],
  theme: {
    extend: {
      colors: {
        // Barvy čtou z CSS proměnných definovaných v src/css/tailwind.css (:root)
        // — uprav hodnoty tam, projeví se to tady všude včetně bg-coral/50 apod.
        coral: "rgb(var(--color-coral) / <alpha-value>)",
        mustard: "rgb(var(--color-mustard) / <alpha-value>)",
        sage: "rgb(var(--color-sage) / <alpha-value>)",
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
      },
      fontFamily: {
        script: ['"Kaushan Script"', "cursive"], // styl blízký logu
        display: ['"Fredoka"', "sans-serif"],
        body: ['"EB Garamond"', "serif"],
        label: ['"Jost"', "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.35em",
      },
    },
  },
  plugins: [],
};
