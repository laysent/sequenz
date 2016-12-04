import fromIterable from './fromIterable';
import { identity } from './utils';

export default (predicate = identity) => subscribe => onNext => {
  let cache = [];
  subscribe((element, i) => {
    if (predicate(element, i)) cache.push(element);
    else if (cache.length !== 0) cache = [];
    return true;
  });
  return fromIterable(cache)(onNext);
};
