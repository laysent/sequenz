/**
 * Invokes method with intermediate value, while keeping the value unchanged.
 *
 * @param {function(any,any):void} f - Invoked on every intermediate value, while the return of each
 * call is omitted.
 */
const intercept = f => subscribe => onNext => subscribe((element, key) => {
  f(element, key);
  return onNext(element, key);
});
export default intercept;
