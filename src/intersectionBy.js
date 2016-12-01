import intersectionOrigin from './_intersection';
import { identity } from './utils';

export default (iteratee = identity) => (...inputs) =>
  intersectionOrigin(iteratee, undefined, ...inputs);
