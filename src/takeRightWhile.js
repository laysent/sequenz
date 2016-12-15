import fromIterable from './fromIterable';
import { identity } from './utils';

/**
 * Take elements from right hand side as long as the elements result in truthy value from
 * `predicate`.
 *
 * @param {function(any,any):boolean} predicate - Predicate function to check each element.
 */
const takeRightWhile = (predicate = identity) => subscribe => onNext => {
  let cache = [];
  subscribe((element, i) => {
    if (predicate(element, i)) cache.push(element);
    else if (cache.length !== 0) cache = [];
    return true;
  });
  return fromIterable(cache)(onNext);
};
export default takeRightWhile;
