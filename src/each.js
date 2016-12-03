/**
 * Iterate over each element in `sequenz`
 *
 * @param {function(any,any):boolean} f - Callback that will be triggered for every element in
 * `sequenz`. Returning `false` will terminate the iteration.
 */
const each = f => subscribe => subscribe(f);
export default each;
