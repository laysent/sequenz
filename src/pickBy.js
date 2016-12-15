/**
 * Keep only the elements that `predicate` returns true. Unlike `filter` API, this API will keep the
 * origin `key` value unchanged.
 *
 * @param {function(any,any):boolean} predicate - Check if value should be kept or ignored.
 */
const pickBy = predicate => subscribe => (onNext) => subscribe((element, key) => {
  if (predicate(element, key)) return onNext(element, key);
  return true;
});
export default pickBy;
