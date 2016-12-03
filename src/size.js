import reduce from './reduce';
/**
 * Gets the size of a `sequenz`.
 */
const size = () => subscribe => reduce((count) => count + 1, 0)(subscribe);
export default size;
