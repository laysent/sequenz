/**
 * Zip existing arrays with sequenz. Each element in new created sequenz will be an array,
 * containing elements from existing arrays and sequenz, where first element will be from
 * sequenz, the rest will be from existing arrays, with order kept.
 *
 * @param {...any[]} inputs - list of arrays.
 */
const zip = (...inputs) => subscribe => onNext =>
  subscribe((element, i) => {
    const result = [element].concat(inputs.map(input => input[i]));
    return onNext(result, i);
  });

export default zip;
