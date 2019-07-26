import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import { sync } from 'rimraf';

const production = !process.env.ROLLUP_WATCH;

sync('public');

export default {
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    format: 'esm',
    dir: 'public',
    preferConst: true,
  },
  plugins: [
    resolve({
      extensions: ['.ts'],
      browser: true,
      modulesOnly: true,
    }),
    babel({
      extensions: ['.ts'],
    }),
    postcss({
      extract: true,
      minimize: production,
      sourceMap: true,
      config: {
        ctx: {
          production,
        },
      },
    }),
    copy({
      targets: [
        {
          src: 'src/index.html',
          dest: 'public',
        },
      ],
    }),
    production &&
      terser({
        module: true,
        mangle: {
          module: true,
        },
      }),
  ],
  treeshake: production,
};
