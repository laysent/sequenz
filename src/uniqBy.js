import Set from './_set';
import filter from './filter';
import { identity } from './utils';

/**
 * This method is like `sequenz.uniq`, except that it accepts `iteratee` which is invoked for each
 * element in sequenz to generate the criterion by which uniqueness is computed. The order is
 * determined by the order they occur in the array.
 *
 * The iteratee is invoked with one argument: `value`.
 *
 * @param {function(any):any} iteratee - Iteratee invoked for each element.
 */
const uniqBy = (iteratee = identity) => {
  const set = new Set();
  return filter(x => {
    const element = iteratee(x);
    const result = set.has(element);
    if (result) return false;
    set.add(element);
    return true;
  });
};
export default uniqBy;
