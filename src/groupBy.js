import { isString } from './utils';

const groupBy = (iteratee) => {
  const mapFn = isString(iteratee) ? element => element[iteratee] : iteratee;
  return subscribe => onNext => {
    const cache = { };
    const doNext = (key, element) => {
      if (!cache[key] || !cache[key].onNext) return;
      if (cache[key].onNext(element, cache[key].count) === false) {
        cache[key].onNext = null;
      } else {
        cache[key].count += 1;
      }
    }
    return subscribe((element, i) => {
      const key = mapFn(element, i);
      if (cache[key]) {
        doNext(key, element);
      } else {
        if (onNext((onNextForThisKey) => {
          cache[key] = {
            onNext: onNextForThisKey,
            count: 0,
          };
        }, key) === false) {
          doNext(key, element);
          return false;
        } else {
          doNext(key, element);
        }
      }
    });
  };
};

export default groupBy;
