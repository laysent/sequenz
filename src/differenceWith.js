import differenceOrigin from './_difference';
import { equal } from './utils';

/**
 * High oder function that acts similarly as `sequenz.difference`, except that it first accepts a
 * customized comparator function that will be used to compara values.
 *
 * @param {function(any,any):number} [comparator=equal] Comparator function that will be used to
 * compara alues. Comparator should return `0` when two values are equal.
 */
const differenceWith = (comparator = equal) => (...inputs) =>
  differenceOrigin(undefined, comparator, ...inputs);
export default differenceWith;
