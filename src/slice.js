import take from './take';
import skip from './skip';
import compose from './compose';

export default (start = 0, end = Infinity) => compose(
  skip(start),
  take(end - start)
);
