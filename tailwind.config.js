/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@catppuccin/tailwindcss")({
      prefix: false,
      defaultFlavour: "latte",
    }),
  ],
};
