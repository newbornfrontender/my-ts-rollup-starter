const postcss = require('./plugins/babel/postcss');

module.exports = {
  presets: ['@babel/env', '@babel/typescript'],
  // plugins: [postcss],
};
