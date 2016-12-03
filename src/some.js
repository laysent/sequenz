import every from './every';
import { identity, not } from './utils';

/**
 * Check if `predicate` returns truthy for **any** elements of given `sequenz`. Iteration will stops
 * once `predicate` returns truthy. The `predicate` is invoked with two arguments: (value, key).
 *
 * @param {function(any,any):boolean} [predicate=identity] The function invoked per iteration.
 */
const some = (predicate = identity) => subscribe => !every(not(predicate, 2))(subscribe);

export default some;
