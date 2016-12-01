export default () => {
  let start = 0;
  let stop;
  let step = 1;
  if (arguments.length === 1) stop = arguments[0];
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
