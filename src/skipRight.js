import { identity } from './utils';

export default (num = 1) => {
  if (num < 1) return identity;
  const n = Math.floor(num);
  const cache = new Array(n);
  let count = -1;
  let result = true;
  let idx = -1;
  return subscribe => onNext => subscribe((element) => {
    count += 1;
    idx = count % n;
    if (count >= n) {
      result = onNext(cache[idx], count);
    }
    cache[idx] = element;
    return result;
  });
};
