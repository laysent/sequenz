import reduce from './reduce';
import { isString } from './utils';

export default iteratee => {
  const mapFn = isString(iteratee) ? element => element[iteratee] : iteratee;
  return subscribe => reduce(
    (previous, element) => {
      const key = mapFn(element);
      if (Object.prototype.hasOwnProperty.call(previous, key)) {
        previous[key].push(element);
      } else {
        previous[key] = [element]; // eslint-disable-line no-param-reassign
      }
      return previous;
    },
    {}
  )(subscribe);
};
