import { truthy } from './utils';

/**
 * Split elements into groups, where each group is an array with specified given `length`.
 * If elements are not able to be splitted evenly, the last group will contain the rest elements,
 * having `length` smaller or equal to specified size.
 *
 * @param {number} [size=1] size - length of each group (default value is 1)
 * Falsey or negative values will be treated as 0, and number will be coerced to integer.
 */
const chunk = (size = 1) => {
  if (!size || size < 1) return () => truthy;
  const sizeNum = Math.floor(size);
  return subscribe =>
  /**
   * @param {function(Array<any>,number):boolean} onNext - callback for receiving next element.
   * First param will be the group of elements, second param will be the current index of group.
   * Callback should return `false` if no longer interested in further elements.
   * @return {boolean} whether the iteration has terminated by accident
   */
  (onNext) => {
    let cache = [];
    let count = 0;
    const result = subscribe((element) => {
      cache.push(element);
      if (cache.length >= sizeNum) {
        if (onNext(cache, count) === false) {
          return false;
        }
        count += 1;
        cache = [];
      }
      return true;
    });
    if (cache.length !== 0) return onNext(cache, count + 1);
    return result;
  };
};

export default chunk;
