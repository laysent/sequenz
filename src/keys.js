/**
 * Creates a new `sequenz` where `element` is the `key` in previous `sequenz` and it's index as the
 * new `key`.
 */
const keys = () => subscribe => onNext => {
  let count = -1;
  return subscribe((_, key) => {
    count += 1;
    onNext(key, count);
  });
};
export default keys;
