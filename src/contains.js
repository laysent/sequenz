import indexOf from './indexOf';

/**
 * Check whether the given value is contained in sequenz. Comparasion will be made using strict
 * equal `===`.
 *
 * @param {any} value - Value that should be used in search.
 * @param {number} fromIndex - Starting index for seaching.
 */
const contains = (value, fromIndex = 0) => subscribe => indexOf(value, fromIndex)(subscribe) >= 0;
export default contains;
