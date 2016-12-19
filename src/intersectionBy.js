import compose from './compose';
import from from './from';
import filter from './filter';
import each from './each';
import Map from './_map';
import { identity } from './utils';

/**
 * High oder function that acts similarly as `sequenz.intersection`, except that it first accepts an
 * iteratee function that will be used to map result values, before they get compared. The result
 * element will still be the original value.
 *
 * @param {function(any):any} [iteratee=identity] Iteratee function that will be used to calculate
 * value for comparation.
 */
const intersectionBy = (iteratee = identity) => (...inputs) => {
  const map = new Map();
  const length = inputs.length;
  compose(
    from,
    each((input) => {
      compose(
        from,
        each((x) => {
          const element = iteratee(x);
          if (!map.has(element)) {
            map.set(element, 1);
          } else {
            map.set(element, map.get(element) + 1);
          }
        })
      )(input);
    })
  )(inputs);
  return filter(x => {
    const element = iteratee(x);
    return map.get(element) === length;
  });
};

export default intersectionBy;
