/**
 * Continously ignore elements at front, if `predicate` returns thruthy.
 *
 * @param {function(any,any):boolean} predicate - Whether the element at front should be ignored.
 * This function will not be called when first element results in falsey.
 */
const skipWhile = predicate => subscribe => (onNext) => {
  let shouldSkip = true;
  let count = -1;
  return subscribe((element, key) => {
    if (shouldSkip && predicate(element, key)) return true;
    shouldSkip = false;
    count += 1;
    return onNext(element, count);
  });
};
export default skipWhile;
