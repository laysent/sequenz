import takeRight from './takeRight';
import first from './first';
import skip from './skip';
import compose from './compose';

/**
 * Find the nth element in sequenz. `undefined` will be returned if sequenz does not have `n`
 * elements.
 *
 * @param {number} n - Index for element. If negative number is provided, it will be count from
 * right to left.
 */
const nth = (n = 0) => {
  if (n >= 0) return compose(skip(n - 1), first());
  return compose(takeRight(n * -1), first());
};
export default nth;
