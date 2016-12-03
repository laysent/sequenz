/**
 * Gets the last element of `sequenz` or use `defaultValue` if `sequenz` is empty.
 *
 * @param {any} defaultValue - Value that will be used if `sequenz` is empty
 */
const lastOrDefault = (defaultValue) => subscribe => {
  let value = defaultValue;
  subscribe(element => { value = element; });
  return value;
};
export default lastOrDefault;
