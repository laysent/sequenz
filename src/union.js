import unionBy from './unionBy';
import { identity } from './utils';

/**
 * Create a sequenz of values that only appears in ANY given array or sequenz, each element will
 * only appear once.
 *
 * @param {...Array} inputs - The values to include. If given is not array, it will be converted to
 * based on implementation of `sequenz.from`.
 */
const union = unionBy(identity);
export default union;
