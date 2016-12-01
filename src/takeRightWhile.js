import { identity } from './utils';
export default (predicate = identity) => subscribe => onNext => {
  let cache = [];
  subscribe((element, i) => {
    if (predicate(element, i)) cache.push(element);
    else if (cache.length !== 0) cache = [];
    return true;
  });
  for (let i = 0; i < cache.length; i += 1) {
    if (onNext(cache[i], i) === false) return false;
  }
  return true;
};
