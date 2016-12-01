import filter from './filter';
import { not, identity } from './utils';

export default (f = identity) => filter(not(f, 2));
