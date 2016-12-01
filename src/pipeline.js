import { isArray, isString, isObject, isFunction, identity } from './utils';
import fromIterable from './fromIterable';
import fromObject from './fromObject';
import just from './just';
import toList from './toList';
import toString from './toString';
import toObject from './toObject';

export default (...transforms) => input => {
  if (process.env.NODE_ENV !== 'production') {
    // TODO
  }
  const convert = (from = identity, to = identity) => {
    const result = transforms.reduce((prev, curr) => curr(prev), from(input));
    if (typeof result === 'function') return to(result);
    return result;
  };
  if (isArray(input)) {
    return convert(fromIterable, toList);
  } else if (isString(input)) {
    return convert(fromIterable, toString);
  } else if (isObject(input)) {
    return convert(fromObject, toObject);
  } else if (isFunction(input)) {
    return convert();
  }
  return transforms.reduce((prev, curr) => curr(prev), just(input));
};
