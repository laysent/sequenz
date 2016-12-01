export default f => subscribe => (onNext) =>
  subscribe((element, key) => onNext(f(element, key), key));
