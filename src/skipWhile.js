export default f => subscribe => (onNext) => {
  let shouldSkip = true;
  let count = -1;
  return subscribe((element, key) => {
    if (shouldSkip && f(element, key)) return true;
    shouldSkip = false;
    count += 1;
    return onNext(element, count);
  });
};
