import filter from './filter';

const isMatch = (properties) => (obj) => {
  for (const key in properties) { // eslint-disable-line no-restricted-syntax
    if (!Object.prototype.hasOwnProperty.call(obj, key) || properties[key] !== obj[key]) {
      return false;
    }
  }
  return true;
};

/**
 * Looks through each element in `sequenz` and returns all elements that contains the given
 * key-value pairs specified in `properties`.
 *
 * @param {object} properties - Key-value pairs.
 */
const where = properties => filter(isMatch(properties));
export default where;
