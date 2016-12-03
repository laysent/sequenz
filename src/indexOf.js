import findIndex from './findIndex';
import findLastIndex from './findLastIndex';

/**
 * Gets the index at which the first occurrence of `value` is found in `sequenz`.
 *
 * @param {any} value - Value to search for.
 * @param {number} [fromIndex=0] - The index to search from. If index is negative number, it will be
 * used as offset from the end of `sequenz`.
 */
const indexOf = (value, fromIndex = 0) => (
  fromIndex < 0 ?
  findLastIndex(x => x === value, -1 * fromIndex) :
  findIndex(x => x === value, fromIndex)
);

export default indexOf;
