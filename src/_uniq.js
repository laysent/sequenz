import { identity, equal } from './utils';

export default (iteratee = identity, comparator = equal) => subscribe => {
  const cache = [];
  return onNext => subscribe((element) => {
    if (cache.some(value => comparator(iteratee(value), iteratee(element)))) return true;
    cache.push(element);
    return onNext(element, cache.length - 1);
  });
};
