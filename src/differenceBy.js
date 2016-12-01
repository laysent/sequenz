import differenceOrigin from './_difference';
import { identity } from './utils';

export default (iteratee = identity) => (...inputs) =>
  differenceOrigin(iteratee, undefined, ...inputs);
