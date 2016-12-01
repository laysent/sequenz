import { isArray } from './utils';
import fromIterable from './fromIterable';

export default (iteratee) => subscribe => onNext => {
  let cache;
  subscribe(element => {
    if (!isArray(element)) throw new Error('Element is not an array!');
    if (!cache) cache = new Array(element.length);
    for (let i = 0; i < element.length; i += 1) {
      if (!cache[i]) cache[i] = [iteratee(element[i])];
      else cache[i].push(iteratee(element[i]));
    }
  });
  return fromIterable(cache)(onNext);
};
