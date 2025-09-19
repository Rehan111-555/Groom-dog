/** @type {import('tailwindcss').Config} */
export default {
  // Cover everything in /app (JS/TS, server/client components)
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5", // used by .btn-primary
          700: "#4338ca", // used by .btn-primary:hover
          800: "#3730a3",
          900: "#312e81",
        },
      },
      boxShadow: {
        // used by .card
        soft: "0 12px 30px rgba(0,0,0,0.08)",
      },
      container: {
        center: true,
        padding: "1.5rem",
      },
    },
  },
  plugins: [],
};
