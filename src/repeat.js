/**
 * Generate a new `sequenz` which will repeat element specified times.
 *
 * @param {any} element - Element to be provided.
 * @param {number} times - Total time that the element should be provided.
 * @return {boolean} Whether the `sequenz` is terminated manually.
 */
const repeat = (element, times = 1) => onNext => {
  if (times < 1) return true;
  const bound = Math.floor(times);
  for (let i = 0; i < bound; i += 1) if (onNext(element, i) === false) return false;
  return true;
};
export default repeat;
