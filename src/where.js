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
export default properties => filter(isMatch(properties));
