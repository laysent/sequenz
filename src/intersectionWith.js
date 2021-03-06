import intersection from './intersection';
import { isArray } from './utils';
import from from './from';
import toList from './toList';
import compose from './compose';
import filter from './filter';
import map from './map';
import reduce from './reduce';
import list from './list';

/**
 * High oder function that acts similarly as `sequenz.intersection`, except that it first
 * accepts a customized comparator function that will be used to compara values.
 *
 * @param {function(any,any):number} [comparator=equal] Comparator function that will be used to
 * compara alues. Comparator should return `0` when two values are equal.
 */
const intersectionWith = (comparator) => {
  if (comparator === undefined) return intersection;
  return (...inputs) => {
    const length = inputs.length;
    const values = list(
      map((input) => {
        if (isArray(input)) return input;
        return compose(from, toList)(input);
      }),
      reduce((ret, input) => ret.concat(input))
    )(inputs);
    return filter(x => list(filter(y => comparator(x, y) === 0))(values).length === length);
  };
};

export default intersectionWith;
