/**
 * Generate a new `sequenz` depends on given range parameters.
 *
 * + If no param is provided, it will generate an infinite `sequenz` that requires manual stop.
 * + If one param is provided, it will be used as `stop` index.
 * + If two params are provided, it will be used as `start` and `stop` index.
 * + If three params are provided, it will be used as `start`, `stop` and `step`.
 *
 * @param {?number} start - Start index of range.
 * @param {?number} stop - Stop index (exclude) of range.
 * @param {?number} step - Step size of each iteration.
 */
const range = function range() {
  let start = 0;
  let stop;
  let step = 1;
  /* eslint-disable prefer-rest-params */
  if (arguments.length === 0) stop = Infinity;
  else if (arguments.length === 1) stop = arguments[0];
  else if (arguments.length === 2) {
    start = arguments[0];
    stop = arguments[1];
  } else {
    start = arguments[0];
    stop = arguments[1];
    step = arguments[2];
  }
  return onNext => {
    for (let i = start, count = 0; i < stop; i += step, count += 1) {
      if (onNext(i, count) === false) return false;
    }
    return true;
  };
};
export default range;
