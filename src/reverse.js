import toList from './toList';
/**
 * Reverse the `sequenz` and provide new key to each element, which is the new order index of each
 * element, starting from `0`.
 */
const reverse = () => subscribe => onNext => {
  const result = toList(subscribe);
  const length = result.length;
  for (let i = length - 1; i >= 0; i -= 1) {
    if (onNext(result[i], length - i - 1) === false) return false;
  }
  return true;
};
export default reverse;
