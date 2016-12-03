/**
 * Keep elements that `predicate` returns truthy for.
 *
 * **[NOTICE]**: Elements passed `predicate` will be provided with a new `key` that starts from `0`.
 * To prevent the original `key`, `sequenz.pickBy` should be used instead.
 *
 * @param {function(any,any):boolean} predicate - The function invoked per iteration.
 */
const filter = predicate => subscribe =>
/**
 * @param {function(any,any):boolean} onNext - Consumer that handles each element.
 * @return {boolean} Whether the iteration is terminated in middle.
 */
(onNext) => {
  let count = -1;
  return subscribe((element, key) => {
    if (predicate(element, key)) {
      count += 1;
      return onNext(element, count);
    }
    return true;
  });
};
export default filter;
