/**
 * This method is similar as `fromPairs` except that the first param here is an array of pre-defined
 * keys.
 *
 * @param {string[]} keys - An array of keys
 */
const zipObject = keys => subscribe => onNext =>
  subscribe((element, i) => (keys.length > i ? onNext(element, keys[i]) : false));
export default zipObject;
