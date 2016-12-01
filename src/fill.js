export default (value, start, end) => {
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
