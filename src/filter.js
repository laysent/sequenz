export default f => subscribe => (onNext) => {
  let count = -1;
  return subscribe((element, key) => {
    if (f(element, key)) {
      count += 1;
      return onNext(element, count);
    }
    return true;
  });
};
