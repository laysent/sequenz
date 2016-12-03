/**
 * Creates a new `sequenz` of values by running each element of given `sequenz` with `iteratee`,
 * while keeping the `key` unmodified. The `iteratee` is invoked with two arguments: `element` and
 * `key`.
 *
 * @param {function(any,any):any} iteratee - Function to create new `element`.
 */
const map = iteratee => subscribe => (onNext) =>
  subscribe((element, key) => onNext(iteratee(element, key), key));
export default map;
