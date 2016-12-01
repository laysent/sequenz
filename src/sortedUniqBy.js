export default (iteratee) => subscribe => onNext => {
  let previous;
  let count = -1;
  return subscribe((element) => {
    const item = iteratee(element);
    if (count >= 0 && previous === item) return true;
    count += 1;
    previous = item;
    return onNext(element, count);
  });
};
