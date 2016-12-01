import differenceOrigin from './_difference';
import { equal } from './utils';

export default (comparator = equal) => (...inputs) =>
  differenceOrigin(undefined, comparator, ...inputs);
