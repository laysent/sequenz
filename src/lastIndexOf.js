import indexOf from './indexOf';
import findLastIndex from './findLastIndex';

/**
 * Gets the index at which the last occurrence of `value` is found in `sequenz`.
 *
 * @param {any} value - Value to search for.
 * @param {number} [fromIndex=0] - The index to search from. Unlike `sequenz.indexOf`, index must be
 * non-negative.
 */
const lastIndexOf = (value, fromIndex = 0) => findLastIndex(x => x === value, fromIndex);
export default lastIndexOf;
