export default f => subscribe => (onNext) => subscribe((element, key) => {
  if (f(element, key)) return onNext(element, key);
  return true;
});
