import differenceWith from './differenceWith';

/**
 * Create a sequenz of values that do not appear in other given arrays.
 *
 * @param {...Array} inputs - The values to exclude. If given is not array, it will be converted to
 * based on implementation of `sequenz.from`.
 */
const difference = (...inputs) => differenceWith()(...inputs);
export default difference;
