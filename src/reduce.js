/**
 * Reduce a `sequenz` to one final value by applying the `iteratee` against an accumulator and each
 * element in `sequenz`.
 *
 * @param {function(any,any,any):any} iteratee - Function to execute on each value in the `sequenz`,
 * taking three arguments: **accumulator**, **current value** and **current index**
 * @param {?any} initial - Value to use as the first accumulator. If not provided, the first element
 * will be used as initial value instead (`iteratee` will not be called for first element in this
 * case then).
 */
const reduce = function reduce(iteratee, initial) {
  if (arguments.length === 1) { // eslint-disable-line prefer-rest-params
    return (subscribe) => {
      let result;
      let hasInitial = false;
      subscribe((element, key) => {
        if (!hasInitial) {
          hasInitial = true;
          result = element;
        } else {
          result = iteratee(result, element, key);
        }
      });
      return result;
    };
  }
  return (subscribe) => {
    let result = initial;
    subscribe((element, key) => {
      result = iteratee(result, element, key);
    });
    return result;
  };
};

export default reduce;
