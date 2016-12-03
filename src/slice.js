import take from './take';
import skip from './skip';
import compose from './compose';

/**
 * Creates a slice of `sequenz` from `start` up to, but not including, `end`
 *
 * @param {number} [start=0] Start index.
 * @param {number} [end=Infinity] End index.
 */
const slice = (start = 0, end = Infinity) => compose(
  skip(start),
  take(end - start)
);

export default slice;
