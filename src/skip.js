import skipWhile from './skipWhile';
import { identity } from './utils';

/**
 * Skip first given number of elements.
 *
 * @param {number} num - Number of elements should be ignored.
 */
const skip = (num = 1) => {
  if (!num) return identity; // do not drop any element
  const n = Math.floor(num);
  return skipWhile((_, i) => i < n);
};
export default skip;
