/**
 * Group key and element into an array [key, element].
 */
const pairs = () => subscribe => onNext => {
  let count = -1;
  return subscribe((element, key) => {
    count += 1;
    return onNext([key, element], count);
  });
};
export default pairs;
