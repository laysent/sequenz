import take from './take';
import skip from './skip';
import takeRight from './takeRight';
import skipRight from './skipRight';
import compose from './compose';

/**
 * Creates a slice of `sequenz` from `start` up to, but not including, `end`
 *
 * @param {number} [start=0] Start index.
 * @param {number} [end=Infinity] End index.
 */
const slice = (start = 0, end = Infinity) => compose(
  start >= 0 ? skip(start) : takeRight(-1 * start),
  end >= 0 ? take(end - start) : skipRight(-1 * end)
);

export default slice;
