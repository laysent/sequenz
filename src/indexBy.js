import reduce from './reduce';
import { isString } from './utils';

export default iteratee => {
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
