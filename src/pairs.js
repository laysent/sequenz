export default () => subscribe => onNext => {
  let count = -1;
  return subscribe((element, key) => {
    count += 1;
    return onNext([key, element], count);
  });
};
