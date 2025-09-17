
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          600: "#4f46e5",
          700: "#4338ca"
        }
      },
      boxShadow: {
        soft: "0 12px 30px rgba(0,0,0,0.08)"
      }
    },
  },
  plugins: [],
};
