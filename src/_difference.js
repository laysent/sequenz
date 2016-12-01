import { identity, equal, isArray } from './utils';
import compose from './compose';
import from from './from';
import map from './map';
import toList from './toList';
import filter from './filter';

export default (iteratee = identity, comparator = equal, ...inputs) => {
  let values;
  if (iteratee === identity) {
    values = inputs.map((input) => {
      if (isArray(input)) return input;
      return compose(from, toList)(input);
    }).reduce((ret, input) => ret.concat(input));
    return filter(x => values.every(y => comparator(x, y) !== 0));
  }
  values = inputs.map((input) => compose(from, map(iteratee), toList)(input))
    .reduce((ret, value) => ret.concat(value));
  return filter(x => values.every(y => comparator(iteratee(x), y) !== 0));
};
