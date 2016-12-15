import { identity } from './utils';

/**
 * Take elements as long as each of then result in truthy value from `predicate`.
 *
 * @param {function(any,any):boolean} predicate - Determine whether a value should be kept.
 */
const takeWhile = (predicate = identity) => subscribe => (onNext) =>
  subscribe((element, key) => {
    if (predicate(element, key)) return onNext(element, key);
    return false;
  });
export default takeWhile;
