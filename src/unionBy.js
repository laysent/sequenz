import uniqBy from './uniqBy';
import { identity, isArray } from './utils';
import compose from './compose';
import from from './from';
import toList from './toList';
import concat from './concat';

/**
 * High oder function that acts similarly as `sequenz.union`, except that it first accepts an
 * iteratee function that will be used to map result values, before they get compared. The result
 * element will still be the original value.
 *
 * @param {function(any):any} [iteratee=identity] Iteratee function that will be used to calculate
 * value for comparation.
 */
const unionBy = (iteratee = identity) => (...inputs) => {
  const list = inputs.map(input => {
    /** todo: consider following an API, as it used in many places, such as `intersection` */
    if (isArray(input)) return input;
    return compose(from, toList)(input);
  }).reduce((prev, curr) => prev.concat(curr));
  return compose(
    concat(list),
    uniqBy(iteratee)
  );
};

export default unionBy;
