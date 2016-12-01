import intersectionOrigin from './_intersection';
import { equal } from './utils';

export default (comparator = equal) => (...inputs) =>
  intersectionOrigin(undefined, comparator, ...inputs);
