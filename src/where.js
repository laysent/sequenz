import filter from './filter';

const isMatch = (properties) => {
  const keys = Object.keys(properties);
  const length = keys.length;
  return (obj) => {
    for (let i = 0; i < length; i += 1) {
      const key = keys[i];
      if (!Object.prototype.hasOwnProperty.call(obj, key) || properties[key] !== obj[key]) {
        return false;
      }
    }
    return true;
  };
};
/**
 * Looks through each element in `sequenz` and returns all elements that contains the given
 * key-value pairs specified in `properties`.
 *
 * @param {object} properties - Key-value pairs.
 */
const where = properties => filter(isMatch(properties));
export default where;
