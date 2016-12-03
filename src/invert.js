/**
 * Creates a new `sequenz` where element and key are key and element in previous `sequenz`
 * respectively.
 */
const invert = () => subscribe => onNext => subscribe((element, key) => onNext(key, element));
export default invert;
