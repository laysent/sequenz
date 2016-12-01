import { identity } from './utils';

export default (iteratee = identity, ...values) => subscribe => onNext => {
  const inputs = [undefined, ...values];
  return subscribe((element, i) => onNext(
    iteratee.apply(null, inputs.map((list, index) => (index ? list[i] : element))),
    i
  ));
};
