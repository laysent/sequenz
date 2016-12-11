import uniqBy from './uniqBy';
import { identity } from './utils';

/**
 * Creates a duplicate-free version of an array. The order of result values is determined by The
 * order they occur in the array.
 */
const uniq = () => uniqBy(identity);
export default uniq;
