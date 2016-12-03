import pickBy from './pickBy';
import { isFunction } from './utils';
export default () => pickBy(isFunction);
