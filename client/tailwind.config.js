/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "pulse-left-to-right": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "100%": {
            backgroundPosition: "100% 50%",
          },
        },
      },
      animation: {
        "pulse-left-to-right": "pulse-left-to-right 2s linear infinite",
      },

      colors: {
        background: "#f3d5b5",
        secondary: "#e7bc91",
        primary: "#6f4518",
        dark: "#ffedd8",
        orange: "#8b5e34",
        name: "#a47148",
        credits: "#a47148",
        desc: "#a47148",
        date: "#bc8a5f",
      },
    },
  },
  plugins: [],
};
