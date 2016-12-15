/**
 * Take given number of elements counting from right hand side of sequenz.
 *
 * [NOTICE]: This API needs to first iterate over ALL elements in sequenz to produce a new sequenz
 * containing only the required elements.
 *
 * @param {number} num - Number of elements to receive.
 */
const takeRight = (num = 1) => subscribe => onNext => {
  const length = Math.floor(num) || 0;
  if (length < 1) return true;
  const cache = length > 200 ? [] : new Array(length);
  let index = -1;
  let hasMoreThanNecessary = false;
  const doNext = (start, end, shift) => {
    for (let i = start; i < end; i += 1) {
      if (onNext(cache[i], i - shift) === false) return false;
    }
    return true;
  };
  subscribe((element) => {
    index += 1;
    if (hasMoreThanNecessary || index >= length) hasMoreThanNecessary = true;
    cache[index % length] = element;
  });
  if (!hasMoreThanNecessary) {
    return doNext(0, index + 1, 0);
  }
  const shift = (index + 1) % length;
  if (doNext(shift, length, shift) === false) return false;
  return doNext(0, shift, shift - length);
};
export default takeRight;
