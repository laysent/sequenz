import skipWhile from './skipWhile';
import { identity } from './utils';

export default (num = 1) => {
  if (!num) return identity; // do not drop any element
  const n = Math.floor(num);
  return skipWhile((_, i) => i < n);
};
