import takeRight from './takeRight';
import first from './first';
import skip from './skip';
import compose from './compose';

export default (n = 0) => {
  if (n >= 0) return compose(skip(n - 1), first());
  return compose(takeRight(n * -1), first());
};
