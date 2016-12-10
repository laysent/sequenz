import intersectionBy from './intersectionBy';
import { identity } from './utils';

/**
 * Create a sequenz of values that only appears in ALL other given arrays.
 *
 * @param {...Array} inputs - The values to include. If given is not array, it will be converted to
 * based on implementation of `sequenz.from`.
 */
const intersection = intersectionBy(identity);
export default intersection;
