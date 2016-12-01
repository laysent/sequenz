export default f => subscribe => onNext => subscribe((element, key) => {
  f(element, key);
  return onNext(element, key);
});
