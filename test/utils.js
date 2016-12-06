const falsey = [, null, undefined, false, 0, NaN, '']; // eslint-disable-line
const isNotUndefined = x => x !== undefined;
const isEven = x => x % 2 === 0;
const identity = x => x;
const empty = function () { };

module.exports = {
  falsey,
  isNotUndefined,
  isEven,
  identity,
  empty,
};
