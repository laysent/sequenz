import fromIterable from './fromIterable';
import { isArrayLike, isString } from './utils';

export default (depth = 1) => {
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
