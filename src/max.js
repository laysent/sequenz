import reduce from './reduce';
import { identity, isNumber } from './utils';

/**
 * Computes the maximum value of `sequenz`, where rank of each element is calculated using
 * given `iteratee`. If `sequenz` is empty, `undefined` will be returned.
 *
 * @param {function(any,any):number} [iteratee=identity] Function that used to calculate rank of
 * each element. The rank will then be used to determine the maximum element in `sequenz`.
 */
const max = (iteratee = identity) => subscribe => {
  let found = false;
  const ret = (reduce((result, num, key) => {
    const rank = iteratee(num, key);
    if (!isNumber(rank)) return result;
    found = true;
    if (result.rank < rank) {
      return { rank, value: num };
    }
    return result;
  }, { rank: -Infinity, value: -Infinity })(subscribe));
  if (found) return ret.value;
  return undefined;
};

export default max;
