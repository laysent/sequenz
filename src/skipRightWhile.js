import { identity } from './utils';
import fromIterable from './fromIterable';

/**
 * Skip some elements at the end, where each results in truthy value from `predicate` function.
 * These elements should be continuous one after another.
 *
 * @param {function(any,any):boolean} predicate - Whether element should be ignored.
 */
const skipRightWhile = (predicate = identity) => {
  let cache = [];
  let count = -1;
  return subscribe => onNext => {
    const doNext = element => { count += 1; return onNext(element, count); };
    return subscribe((element, key) => {
      if (predicate(element, key)) {
        cache.push(element);
        return true;
      }
      if (cache.length > 0) {
        fromIterable(cache)(doNext);
        cache = [];
      }
      return doNext(element);
    });
  };
};
export default skipRightWhile;
