import { identity, isFunction } from './utils';

export default (iteratee = identity) => subscribe => {
  const result = { };
  const mapFn = isFunction(iteratee) ? iteratee : element => element[iteratee.toString()];
  subscribe((element) => {
    const key = mapFn(element);
    result[key] = result[key] ? (result[key] + 1) : 1;
  });
  return result;
};
