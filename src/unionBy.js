import unionOrigin from './_union';
export default (iteratee) => (...inputs) => unionOrigin(iteratee, undefined, ...inputs);
