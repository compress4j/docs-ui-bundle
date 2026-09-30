/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/layouts/*.hbs", "./src/partials/*.hbs", "./src/js/*.js"],
  darkMode: 'class',
  theme: {
    fontFamily: {
      display: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
      sans: ['"Open Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      serif: ["ui-serif", "serif"],
      mono: ['"Source Code Pro"', "ui-monospace", "monospace"],
    },
    extend: {
      colors: {
        fp: {
          gray: {
            lightest: "#eff0f1",
            lighter: "#dfe0e3",
            light: "#c5c7cc",
            DEFAULT: "#9a9fa6",
            dark: "#79818b",
            darkest: "#535961",
          },
          blue: {
            // A teal/cyan scale anchored on the logo's accent (#00D2FF) and
            // background (#0B0F19), replacing Fedora's blue. `light`/`DEFAULT`/
            // `dark` are used as visible link and accent text/backgrounds in both
            // color schemes; `darker`/`darkest` are dark-mode surface backgrounds.
            light: "#00D2FF",
            DEFAULT: "#0EA5C4",
            dark: "#0B7A94",
            darker: "#0B0F19",
            darkest: "#070911",
          },
          green: {
            lighest: "#d7f9ec",
            light: "#6ee7c0",
            DEFAULT: "#10B981",
          },
          magenta: {
            lightest: "#f9dde9",
            light: "#dc97bb",
            DEFAULT: "#db3279",
          },
          orange: {
            lightest: "#fbeedb",
            light: "#f2ca92",
            DEFAULT: "#e59728",
          },
          purple: {
            lightest: "#ece5f1",
            light: "#cfbddd",
            DEFAULT: "#a07cbc",
          },
        },
      },
    },
  },
  plugins: [],
}
