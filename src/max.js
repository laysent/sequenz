import reduce from './reduce';
import { identity, isNumber } from './utils';

export default (iteratee = identity) => subscribe =>
  (reduce((max, num) => {
    const rank = iteratee(num);
    if (!isNumber(rank)) return max;
    if (max.rank < rank) {
      return { rank, value: num };
    }
    return max;
  }, { rank: -Infinity, value: -Infinity })(subscribe)).value;
