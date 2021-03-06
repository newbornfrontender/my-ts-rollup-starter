module.exports = ({ production }) => ({
  plugins: {
    'postcss-use': true,
    'postcss-import': true,
    'postcss-preset-env': {
      stage: 3,
      autoprefixer: production,
    },
  },
});
