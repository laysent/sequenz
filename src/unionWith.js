import unionOrigin from './_union';
export default (comparator) => (...inputs) => unionOrigin(undefined, comparator, ...inputs);
