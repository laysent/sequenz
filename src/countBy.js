import { identity, isFunction } from './utils';

/**
 * Creates an object containing the key-value pairs, where keys are generated using given `iteratee`
 * and values are the total times each key is generated from elements in sequenz.
 *
 * By default, `identity` function is used as `iteratee`.
 *
 * @param {function(any):string} iteratee - Iteratee function to generate keys.
 */
const countBy = (iteratee = identity) => subscribe => {
  const result = { };
  const mapFn = isFunction(iteratee) ? iteratee : element => element[iteratee.toString()];
  subscribe((element) => {
    const key = mapFn(element);
    result[key] = result[key] ? (result[key] + 1) : 1;
  });
  return result;
};
export default countBy;
