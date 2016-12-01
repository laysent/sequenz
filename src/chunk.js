import { empty } from './utils';

export default (_size = 1) => {
  if (!_size || _size < 1) return () => empty;
  const size = Math.floor(_size);
  return subscribe => (onNext) => {
    let cache = [];
    let count = 0;
    const result = subscribe((element) => {
      cache.push(element);
      if (cache.length >= size) {
        if (onNext(cache, count) === false) {
          return false;
        }
        count += 1;
        cache = [];
      }
      return true;
    });
    if (cache.length !== 0) return onNext(cache, count + 1);
    return result;
  };
};
