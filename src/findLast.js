import findLastOrigin from './_findLast';

/**
 * Find the last value where `predicate` returns true.
 *
 * @param {function(any,any):boolean} predicate - Predicate function to determine if value has been
 * found.
 * @param {number} fromIndex - Index to start searching.
 */
const findLast = (predicate, fromIndex) => subscribe =>
  findLastOrigin(predicate, fromIndex)(subscribe).value;
export default findLast;
