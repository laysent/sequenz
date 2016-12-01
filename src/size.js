import reduce from './reduce';
export default () => subscribe => reduce((count) => count + 1, 0)(subscribe);
