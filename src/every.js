import { identity } from './utils';
export default (predicate = identity) => subscribe => {
  let result = true;
  subscribe((element, key) => {
    if (!predicate(element, key)) {
      result = false;
    }
    return result;
  });
  return result;
};
