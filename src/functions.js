import pickBy from './pickBy';
import { isFunction } from './utils';

/**
 * Filter sequenz to only keep elements that are functions. Key values will be kept in this API.
 * Internally, it uses `pickBy`.
 */
const functions = () => pickBy(isFunction);
export default functions;
