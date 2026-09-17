/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        youna: {
          background: "#fafafa",
          foreground: "#1a1a2e",
          primary: "#6366f1",
          secondary: "#8b5cf6",
          accent: "#ec4899",
          card: "#ffffff",
          "card-foreground": "#1a1a2e",
          muted: "#71717a",
          "muted-foreground": "#71717a",
          border: "#e5e5e5",
          ring: "#6366f1",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
