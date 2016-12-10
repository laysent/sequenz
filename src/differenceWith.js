import difference from './difference';
import { isArray } from './utils';
import from from './from';
import toList from './toList';
import compose from './compose';
import filter from './filter';

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
    const values = inputs.map((input) => {
      if (isArray(input)) return input;
      return compose(from, toList)(input);
    }).reduce((ret, input) => ret.concat(input));
    return filter(x => values.every(y => comparator(x, y) !== 0));
  };
};
export default differenceWith;
