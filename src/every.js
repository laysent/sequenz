import { identity } from './utils';

/**
 * Check if `predicate` returns truthy for **all** elements of given `sequenz`. Iteration will stops
 * once `predicate` returns falsey. The `predicate` is invoked with two arguments: (value, key).
 *
 * @param {function(any,any):boolean} [predicate=identity] The function invoked per iteration.
 */
const every = (predicate = identity) => subscribe => {
  let result = true;
  subscribe((element, key) => {
    if (!predicate(element, key)) {
      result = false;
    }
    return result;
  });
  return result;
};

export default every;
