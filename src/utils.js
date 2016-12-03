export const empty = () => { };
/**
 * Identity function that accepts one argument and returns the exact same argument.
 *
 * @param {T} x - Any value.
 * @return {T} The exact same result as `x`.
 */
export const identity = x => x;
export const truthy = () => true;
export const falsey = () => false;
export const equal = (x, y) => (x === y ? 0 : 1);
export const not = (f, numOfParams) => {
  switch (numOfParams) {
    case 0: return () => !f();
    case 1: return (a) => !f(a);
    case 2: return (a, b) => !f(a, b);
    case 3: return (a, b, c) => !f(a, b, c);
    default: return (...params) => !f(...params);
  }
};

export const isArray = Array.isArray ||
  /* istanbul ignore next */(x => Object.prototype.toString.call(x) === '[object Array]');
export const isString = x => typeof x === 'string' || x instanceof String;
export const isPromise = x => x instanceof Promise;
export const isNumber = x => (x === +x);
export const isObject = x => x instanceof Object && x !== null;
export const isFunction = x => typeof x === 'function';
const isLength = value => isNumber(value) && value >= 0 && value % 1 === 0 && value < Infinity;
export const isArrayLike = x => x != null && !isFunction(x) && isLength(x.length);
