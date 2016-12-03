import differenceOrigin from './_difference';
import { identity } from './utils';

/**
 * High oder function that acts similarly as `sequenz.difference`, except that it first accepts an
 * iteratee function that will be used to map result values, before they get compared. The result
 * element will still be the original value.
 *
 * @param {function(any):any} [iteratee=identity] Iteratee function that will be used to calculate
 * value for comparation.
 */
const differenceBy = (iteratee = identity) => (...inputs) =>
  differenceOrigin(iteratee, undefined, ...inputs);
export default differenceBy;
