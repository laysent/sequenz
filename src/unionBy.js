import uniqBy from './uniqBy';
import { identity, isArray } from './utils';
import compose from './compose';
import from from './from';
import toList from './toList';
import concat from './concat';
import list from './list';
import map from './map';
import reduce from './reduce';


/**
 * High oder function that acts similarly as `sequenz.union`, except that it first accepts an
 * iteratee function that will be used to map result values, before they get compared. The result
 * element will still be the original value.
 *
 * @param {function(any):any} [iteratee=identity] Iteratee function that will be used to calculate
 * value for comparation.
 */
const unionBy = (iteratee = identity) => (...inputs) => {
  const values = list(
    map((input) => {
      if (isArray(input)) return input;
      return compose(from, toList)(input);
    }),
    reduce((prev, curr) => prev.concat(curr))
  )(inputs);
  return compose(
    concat(values),
    uniqBy(iteratee)
  );
};

export default unionBy;
