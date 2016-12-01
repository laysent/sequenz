export default (iteratee, initial) => subscribe => (onNext) => {
  let previous = initial;
  return subscribe((element, key) => {
    previous = iteratee(previous, element);
    return onNext(previous, key);
  });
};
