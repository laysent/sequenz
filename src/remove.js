import filter from './filter';
import { not, identity } from './utils';

/**
 * Remove all elements in `sequenz` where `predicate` returns truthy. This function acts exact the
 * opposite of `sequenz.filter` function.
 *
 * @param {function(any,any):boolean} predicate - Function that returns truthy or falsey for each
 * element in `sequenz`.
 */
const remove = (predicate = identity) => filter(not(predicate, 2));
export default remove;
