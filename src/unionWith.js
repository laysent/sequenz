import { equal, isArray } from './utils';
import compose from './compose';
import from from './from';
import toList from './toList';
import concat from './concat';
import uniqWith from './uniqWith';

/**
 * High oder function that acts similarly as `sequenz.union`, except that it first
 * accepts a customized comparator function that will be used to compara values.
 *
 * @param {function(any,any):number} [comparator=equal] Comparator function that will be used to
 * compara alues. Comparator should return `0` when two values are equal.
 */
const unionWith = (comparator = equal) => (...inputs) => {
  const values = inputs.map((input) => {
    if (isArray(input)) return input;
    return compose(from, toList)(input);
  }).reduce((prev, curr) => prev.concat(curr));
  return compose(
    concat(values),
    uniqWith(comparator)
  );
};

export default unionWith;
