import compose from './compose';
import toString from './toString';
import fromIterable from './fromIterable';

export default (...transforms) => input => {
  const result = compose(fromIterable, ...transforms)(input);
  if (typeof result === 'function') return toString(result);
  return result;
};
