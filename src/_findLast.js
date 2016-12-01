import { identity } from './utils';

export default (predicate = identity, fromIndex = 0) => subscribe => {
  const startIndex = fromIndex ? Math.floor(+fromIndex) : 0;
  let result = { value: undefined, index: -1 };
  subscribe((element, i) => {
    if (i >= startIndex && predicate(element, i)) {
      result = { value: element, index: i };
    }
    return true;
  });
  return result;
};
