import fromIterable from './fromIterable';
import { isArray } from './utils';

export default (depth = 1) => subscribe => onNext => {
  let count = -1;
  const doNext = element => { count += 1; return onNext(element, count); };
  const recursiveSubscribe = (sub, currentDepth) => sub((element) => {
    if (isArray(element) && (currentDepth < depth)) {
      return recursiveSubscribe(fromIterable(element), currentDepth + 1);
    }
    return doNext(element);
  });
  return recursiveSubscribe(subscribe, 0);
};
