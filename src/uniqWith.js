import { equal } from './utils';

/**
 * This method is like `sequenz.uniq`, except that it accepts `comparator` which is invoked for each
 * element in sequenz to compare with all previous elements. The `comparator` will only provides `0`
 * if two elements are considered equal.
 *
 * @param {function(any,any):number} comparator - Comparator invoked for comparing elements, returns
 * `0` if two elements are equal.
 */
const uniqWith = (comparator = equal) => subscribe => {
  const cache = [];
  return onNext => subscribe((element) => {
    if (cache.some(value => comparator(value, element) === 0)) return true;
    cache.push(element);
    return onNext(element, cache.length - 1);
  });
};

export default uniqWith;
