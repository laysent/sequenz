import reduce from './reduce';
import { identity, isNumber } from './utils';

export default (iteratee = identity) => subscribe =>
  (reduce((min, num) => {
    const rank = iteratee(num);
    if (!isNumber(rank)) return min;
    if (min.rank > rank) {
      return { rank, value: num };
    }
    return min;
  }, { rank: Infinity, value: Infinity })(subscribe)).value;
