import { identity, equal, isArray } from './utils';
import compose from './compose';
import concat from './concat';
import from from './from';
import toList from './toList';
import uniqOrigin from './_uniq';

export default (iteratee = identity, comparator = equal, ...inputs) => {
  const values = inputs.map((input) => {
    if (isArray(input)) return input;
    return compose(from, toList)(input);
  }).reduce((prev, curr) => prev.concat(curr));
  return compose(
    concat(values),
    uniqOrigin(iteratee, comparator)
  );
};
