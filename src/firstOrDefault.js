/**
 * Return the first element or `defaultValue` if sequenz is empty.
 *
 * @param {any} defaultValue - Value that will be returned if sequenz is empty.
 */
const firstOrDefault = defaultValue => subscribe => {
  let ret = defaultValue;
  subscribe(element => { ret = element; return false; });
  return ret;
};
export default firstOrDefault;
