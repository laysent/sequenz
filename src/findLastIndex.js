import findLastOrigin from './_findLast';

/**
 * Find the last index in sequenz where `predicate` returns true.
 *
 * @param {function(any,any):boolean} predicate - Predicate function to determine if value has been
 * found.
 * @param {number} fromIndex - Index to start searching.
 */
const findLastIndex = (predicate, fromIndex) => subscribe =>
  findLastOrigin(predicate, fromIndex)(subscribe).index;
export default findLastIndex;
