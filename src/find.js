import findOrigin from './_find';

/**
 * Find the first value where `predicate` returns true.
 *
 * @param {function(any,any):boolean} predicate - Predicate function to determine if value has been
 * found.
 * @param {number} fromIndex - Index to start searching.
 */
const find = (predicate, fromIndex) => subscribe =>
  findOrigin(predicate, fromIndex)(subscribe).value;
export default find;
