/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        flash: "flash 0.4s ease-in-out", // Define the custom flash animation
        userflash: "userflash 0.25s ease-in-out", // Define the custom user flash animation
      },
      keyframes: {
        flash: {
          "0%": { backgroundColor: "white" }, // Initial flash color
          "100%": { backgroundColor: "inherit" }, // End state (return to original color)
        },
        userflash: {
          "0%": { backgroundColor: "green" }, // Initial user flash color
          "100%": { backgroundColor: "inherit" }, // End state (return to original color)
        },
      },
    },
  },
  plugins: [],
};


