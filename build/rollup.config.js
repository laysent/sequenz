import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
export default {
  entry: 'src/index.js',
  format: 'umd',
  plugins: [babel(babelrc())],
  dest: 'sequenz.js',
  moduleId: 'sequenz',
  moduleName: 'sequenz',
};
