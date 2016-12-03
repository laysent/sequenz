import fromIterable from './fromIterable';
import { isArrayLike, isString } from './utils';

/**
 * Recursively flatten elements in `sequenz` up to `depth` times.
 *
 * @param {number} [depth=1] the maximum recursion depth.
 */
const flattenDepth = (depth = 1) => {
  const depthNum = Math.floor(depth);
  return subscribe => onNext => {
    let count = -1;
    const doNext = element => { count += 1; return onNext(element, count); };
    const recursiveSubscribe = (sub, currentDepth) => sub((element) => {
      if (isArrayLike(element) && !isString(element) && (currentDepth < depthNum)) {
        return recursiveSubscribe(fromIterable(element), currentDepth + 1);
      }
      return doNext(element);
    });
    return recursiveSubscribe(subscribe, 0);
  };
};

export default flattenDepth;
