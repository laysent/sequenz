import { identity } from './utils';

export default (iteratee = identity, ...values) => subscribe => onNext =>
  subscribe((key, i) => onNext(
    iteratee.apply(null, values.map(list => list[i])),
    key
  ));
