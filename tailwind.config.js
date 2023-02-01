module.exports = {
  content: ["./src/**/*.{html,njk}"],
  theme: {
    extend: {
      screens: {
        'xxs': '490px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
