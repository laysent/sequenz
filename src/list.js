import compose from './compose';
import fromIterable from './fromIterable';
import toList from './toList';

export default (...transforms) => (input) => {
  const result = compose(fromIterable, ...transforms)(input);
  if (typeof result === 'function') return toList(result);
  return result;
};
