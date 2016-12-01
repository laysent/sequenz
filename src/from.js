import { isArray, isString } from './utils';
import fromIterable from './fromIterable';
// import fromPromise from './fromPromise';
import just from './just';

export default (input) => {
  if (isArray(input) || isString(input)) return fromIterable(input);
  // else if (isPromise(input)) return fromPromise(input);
  else if (typeof input === 'function') return input; // assume it's sequenz already
  return just(input);
};
