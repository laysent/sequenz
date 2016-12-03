import reduce from './reduce';
import { isString } from './utils';

/**
 * Consume the `sequenz`, use `iteratee` to generate `key` for each element, and returns an object
 * with an index of each element.
 *
 * @param {function(any):string|string} iteratee - Function that returns the `key` of each element,
 * or `property` string that will be used to get `key` from each element.
 */
const indexBy = iteratee => {
  const mapFn = isString(iteratee) ? element => element[iteratee] : iteratee;
  return subscribe => reduce(
    (previous, element) => {
      const key = mapFn(element);
      if (process.env.NODE_ENV !== 'production' &&
      Object.prototype.hasOwnProperty.call(previous, key)) {
        console.warn(
          `[WARNING]: \`indexBy\` assumes each key to be uniq. However, ${key} is duplicated.`
        );
      } else {
        previous[key] = element; // eslint-disable-line no-param-reassign
      }
      return previous;
    },
    {}
  )(subscribe);
};

export default indexBy;
