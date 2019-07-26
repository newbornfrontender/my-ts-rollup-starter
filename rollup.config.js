import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { sync } from 'rimraf';

const production = !process.env.ROLLUP_WATCH;

sync('public/**/*.{js,map}');

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
