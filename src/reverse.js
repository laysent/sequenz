import toList from './toList';
export default () => subscribe => onNext => {
  const result = toList(subscribe);
  const length = result.length;
  for (let i = length - 1; i >= 0; i -= 1) {
    if (onNext(result[i], length - i - 1) === false) return false;
  }
  return true;
};
