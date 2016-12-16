import groupBy from './groupBy';

/**
 * Split sequenz into two part, one containing only the sequenz that `predicate` returns truthy
 * result, the other containing only the sequenz that results in falsey value.
 *
 * @param {function(any,any):boolean} predicate - Function to map each element to boolean result.
 * @param {function(string):function} transformGen - Function to generate transformers. More info
 * can be found in `groupBy` API.
 */
const partition = (predicate, transformGen) =>
  groupBy((element, i) => (predicate(element, i) ? 'truthy' : 'falsey'), transformGen);
export default partition;
