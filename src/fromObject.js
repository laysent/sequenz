export default input => (onNext) => {
  for (const key in input) { // eslint-disable-line no-restricted-syntax
    /* istanbul ignore if */
    if (!Object.prototype.hasOwnProperty.call(input, key)) continue;
    if (onNext(input[key], key) === false) return false;
  }
  return true;
};
