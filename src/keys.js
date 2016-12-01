export default () => subscribe => onNext => {
  let count = -1;
  return subscribe((_, key) => {
    count += 1;
    onNext(key, count);
  });
};
