import difference from './difference';

/**
 * Create a sequenz excluding all passed in values via parameters.
 *
 * @param {...any} values - Values that should be excluded.
 */
const without = (...values) => difference(values);
export default without;
