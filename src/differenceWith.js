import difference from './difference';
import { isArray } from './utils';
import from from './from';
import toList from './toList';
import compose from './compose';
import filter from './filter';
import every from './every';
import list from './list';
import map from './map';
import reduce from './reduce';

/**
 * High oder function that acts similarly as `sequenz.difference`, except that it first accepts a
 * customized comparator function that will be used to compara values.
 *
 * @param {function(any,any):number} [comparator=equal] Comparator function that will be used to
 * compara alues. Comparator should return `0` when two values are equal.
 */
const differenceWith = (comparator) => {
  if (comparator === undefined) return difference;
  return (...inputs) => {
    const values = list(
      map((input) => {
        if (isArray(input)) return input;
        return compose(from, toList)(input);
      }),
      reduce((ret, input) => ret.concat(input))
    )(inputs);
    return filter(x => list(every(y => comparator(x, y) !== 0))(values));
  };
};
export default differenceWith;
