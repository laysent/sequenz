import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [babel(babelrc())],
  dest: 'lib/index.js',
};
