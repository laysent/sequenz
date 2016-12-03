/**
 * Fills elements in a `sequenz` with given `value` from `start` up to, but not including, `end`.
 *
 * **[NOTICE]**: The `sequenz` should have keys that are `number`s, as key will be used to compare
 * if given element should be replaced by `value`.
 *
 * @param {any} value - Value to fill
 * @param {number} [start=0] - Start index
 * @param {number} [end=Infinity] - End index
 */
const fill = (value, start, end) => {
  if (start === undefined && end === undefined) {
    return subscribe => onNext => subscribe((_, key) => onNext(value, key));
  }
  const startIdx = !start ? 0 : Math.floor(+start);
  let endIdx;
  if (end === undefined) endIdx = Infinity;
  else if (!end) endIdx = 0;
  else endIdx = Math.floor(+end);
  return subscribe => onNext =>
    subscribe((_, key) => {
      if (startIdx <= key && endIdx > key) return onNext(value, key);
      return onNext(_, key);
    });
};
export default fill;
