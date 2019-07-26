/* eslint-disable */

import postcssrc from 'postcss-load-config';
import postcss from 'postcss';
import { createFilter } from 'rollup-pluginutils';
import { writeFileSync } from 'fs';

export default (options = {}) => {
  let { include, exclude, ctx } = options;

  if (!include) include = '**/*.css';

  const filter = createFilter(include, exclude);

  return {
    name: 'css',

    async transform(source, id) {
      if (!filter(id)) return;

      const filename = id
        .split('\\')
        .pop()
        .split('.')
        .shift();

      const { plugins, options } = await postcssrc(ctx);
      let { css, map } = await postcss(plugins).process(source, {
        ...options,
        from: id,
      });

      css = css.replace(/^\/\*#.*\/$/gm, `/*# sourceMappingURL=${filename}.css.map */`);

      writeFileSync(`public/${filename}.css`, css, () => true);
      writeFileSync(`public/${filename}.css.map`, map.toString(), () => true);

      return {
        code: '',
        map: null,
      };
    },
  };
};
