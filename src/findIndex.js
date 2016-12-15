import findOrigin from './_find';

/**
 * Find the first index in sequenz where `predicate` returns true.
 *
 * @param {function(any,any):boolean} predicate - Predicate function to determine if value has been
 * found.
 * @param {number} fromIndex - Index to start searching.
 */
const findIndex = (predicate, fromIndex) => subscribe =>
  findOrigin(predicate, fromIndex)(subscribe).index;
export default findIndex;
