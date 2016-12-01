import { identity } from './utils';
import fromIterable from './fromIterable';

export default (predicate = identity) => {
  let cache = [];
  let count = -1;
  return subscribe => onNext => {
    const doNext = element => { count += 1; return onNext(element, count); };
    return subscribe((element, key) => {
      if (predicate(element, key)) {
        cache.push(element);
        return true;
      }
      if (cache.length > 0) {
        fromIterable(cache)(doNext);
        cache = [];
      }
      return doNext(element);
    });
  };
};
