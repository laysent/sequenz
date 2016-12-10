import compose from './compose';
import from from './from';
import filter from './filter';
import each from './each';
import Set from './_set';
import { identity } from './utils';

/**
 * High oder function that acts similarly as `sequenz.difference`, except that it first accepts an
 * iteratee function that will be used to map result values, before they get compared. The result
 * element will still be the original value.
 *
 * @param {function(any):any} [iteratee=identity] Iteratee function that will be used to calculate
 * value for comparation.
 */
const differenceBy = (iteratee = identity) => (...inputs) => {
  const set = new Set();
  inputs.forEach(input => {
    compose(
      from,
      each((element) => { set.add(iteratee(element)); })
    )(input);
  });
  return filter(x => {
    const element = iteratee(x);
    if (set.has(element)) return false;
    set.add(element);
    return true;
  });
};
export default differenceBy;
