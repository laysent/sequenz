import toList from './toList';

/**
 * Convert `sequenz` to a string separated by specfied `separator`.
 *
 * @param {string} [separator=","] String to separate each element
 */
const join = (separator = ',') => subscribe => toList(subscribe).join(separator);
export default join;
