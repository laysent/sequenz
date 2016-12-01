export default (element, times) => onNext => {
  for (let i = 0; i < times; i += 1) if (onNext(element, i) === false) return false;
  return true;
};
