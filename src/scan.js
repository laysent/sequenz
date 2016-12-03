/**
 * Accumulate a `sequenz` to create a new `sequenz` by applying the `iteratee` against an
 * accumulator and each element in `sequenz`, the result of each element will form the new
 * `sequenz`.
 *
 * @param {function(any,any,any):any} iteratee - Function to execute on each value in the `sequenz`,
 * taking three arguments: **accumulator**, **current value** and **current index**
 * @param {?any} initial - Value to use as the first accumulator. If not provided, the first element
 * will be used as initial value instead (`iteratee` will not be called for first element in this
 * case then).
 */
const scan = function scan(iteratee, initial) {
  let hasPrevious = arguments.length > 1; // eslint-disable-line prefer-rest-params
  return subscribe => (onNext) => {
    let previous = initial;
    return subscribe((element, key) => {
      if (!hasPrevious) {
        hasPrevious = true;
        previous = element;
        return onNext(element, key);
      }
      previous = iteratee(previous, element, key);
      return onNext(previous, key);
    });
  };
};
export default scan;
