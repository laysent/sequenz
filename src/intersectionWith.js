import intersection from './intersection';
import { isArray } from './utils';
import from from './from';
import toList from './toList';
import compose from './compose';
import filter from './filter';

/**
 * High oder function that acts similarly as `sequenz.intersectionWith`, except that it first
 * accepts a customized comparator function that will be used to compara values.
 *
 * @param {function(any,any):number} [comparator=equal] Comparator function that will be used to
 * compara alues. Comparator should return `0` when two values are equal.
 */
const intersectionWith = (comparator) => {
  if (comparator === undefined) return intersection;
  return (...inputs) => {
    const values = inputs.map((input) => {
      if (isArray(input)) return input;
      return compose(from, toList)(input);
    }).reduce((ret, input) => ret.concat(input));
    return filter(x => values.some(y => comparator(x, y) === 0));
  };
};

export default intersectionWith;
