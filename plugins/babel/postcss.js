const deasync = require('deasync-promise');
const postcss = require('postcss');
const postcssrc = require('postcss-load-config');

const production = !process.env.ROLLUP_WATCH;
const regex = /____EXPR_ID_(\d+)____/g;

const buildQuasisAst = (types, quasis) => {
  return quasis.map((quasi, i) => {
    const isTail = i === quasis.length - 1;

    return types.templateElement({ raw: quasi, cooked: quasi }, isTail);
  });
};

const splitExpressions = (source) => {
  let found = regex.exec(source);
  let matches = [];

  while (found) {
    matches.push(found);
    found = regex.exec(source);
  }

  const reduction = matches.reduce(
    (acc, match) => {
      const [placeholder, exprIndex] = match;

      acc.quasis.push(source.substring(acc.prevEnd, match.index));
      acc.exprs.push(exprIndex);
      acc.prevEnd = match.index + placeholder.length;

      return acc;
    },
    { prevEnd: 0, quasis: [], exprs: [] },
  );

  reduction.quasis.push(source.substring(reduction.prevEnd, source.length));

  return {
    quasis: reduction.quasis,
    exprs: reduction.exprs,
  };
};

const getExprId = (i) => {
  return `____EXPR_ID_${i}____`;
};

module.exports = ({ types }) => {
  return {
    visitor: {
      TaggedTemplateExpression(path, { opts, file }) {
        opts = { tag: 'css' };

        if (path.node.tag.name !== opts.tag) return;
        if (opts.replace) path.node.tag.name = opts.replace;

        const quasis = path.node.quasi.quasis;
        const exprs = path.node.quasi.expressions;
        const source = quasis.reduce((acc, quasi, i) => {
          const expr = exprs[i] ? getExprId(i) : '';

          return acc + quasi.value.raw + expr;
        }, '');
        const { plugins, options } = deasync(postcssrc({ production }));
        const { css } = deasync(
          postcss(plugins).process(source, { ...options, from: file.opts.filename }),
        );
        const split = splitExpressions(css);
        const quasisAst = buildQuasisAst(types, split.quasis);
        const exprsAst = split.exprs.map((exprIndex) => exprs[exprIndex]);

        path.node.quasi.quasis = quasisAst;
        path.node.quasi.expressions = exprsAst;

        if (opts.replace === '') path.replaceWith(types.TemplateLiteral(quasisAst, exprsAst));
      },
    },
  };
};
