import compose from './compose';
import fromObject from './fromObject';
import toObject from './toObject';

export default (...transforms) => (input) => {
  const result = compose(fromObject, ...transforms)(input);
  if (typeof result === 'function') return toObject(result);
  return result;
};
