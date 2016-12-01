import { identity } from './utils';

export default (predicate = identity) => subscribe => (onNext) =>
  subscribe((element, key) => {
    if (predicate(element, key)) return onNext(element, key);
    return false;
  });
