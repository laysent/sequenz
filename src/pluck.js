import map from './map';
/**
 * Extracts specified `property` out of each element and construct a new `sequenz`. The `key` will
 * remain the same.
 *
 * @param {string} propertyName - Name of property.
 */
const pluck = propertyName => map(element => element[propertyName]);
export default pluck;
