(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('sequenz', ['exports'], factory) :
  (factory((global.sequenz = global.sequenz || {})));
}(this, (function (exports) { 'use strict';

var compose = function compose() {
  for (var _len = arguments.length, transforms = Array(_len), _key = 0; _key < _len; _key++) {
    transforms[_key] = arguments[_key];
  }

  return function (input) {
    var ret = input;
    for (var i = 0; i < transforms.length; i += 1) {
      ret = transforms[i](ret);
    }
    return ret;
  };
};

/**
 * convert iterable to sequence. Iterable should contain `length` and should be able to get each
 * element via `[i]`.
 *
 * @param {array|string} input - Iterable. Normally should be either string or array.
 * @return {function} function to receive subscriber
 */
var fromIterable = (function (input) {
  return (
    /**
     * function for subscribe.
     *
     * @param {function} onNext - function to receive each element.
     */
    function (onNext) {
      var length = input.length;
      for (var i = 0; i < length; i += 1) {
        if (onNext(input[i], i) === false) {
          return false;
        }
      }
      return true;
    }
  );
});

var toList = (function (subscribe) {
  var ret = [];
  subscribe(function (element) {
    ret.push(element);
  });
  return ret;
});

var list = (function () {
  for (var _len = arguments.length, transforms = Array(_len), _key = 0; _key < _len; _key++) {
    transforms[_key] = arguments[_key];
  }

  return function (input) {
    var result = compose.apply(undefined, [fromIterable].concat(transforms))(input);
    if (typeof result === 'function') return toList(result);
    return result;
  };
});

var fromObject = (function (input) {
  return function (onNext) {
    for (var key in input) {
      // eslint-disable-line no-restricted-syntax
      /* istanbul ignore if */
      if (!Object.prototype.hasOwnProperty.call(input, key)) continue;
      if (onNext(input[key], key) === false) return false;
    }
    return true;
  };
});

var toObject = (function (subscribe) {
  var ret = {};
  subscribe(function (element, key) {
    ret[key] = element;
  });
  return ret;
});

var object = (function () {
  for (var _len = arguments.length, transforms = Array(_len), _key = 0; _key < _len; _key++) {
    transforms[_key] = arguments[_key];
  }

  return function (input) {
    var result = compose.apply(undefined, [fromObject].concat(transforms))(input);
    if (typeof result === 'function') return toObject(result);
    return result;
  };
});

var toString = (function (subscribe) {
  var ret = '';
  subscribe(function (char) {
    ret += char;
  });
  return ret;
});

var string = (function () {
  for (var _len = arguments.length, transforms = Array(_len), _key = 0; _key < _len; _key++) {
    transforms[_key] = arguments[_key];
  }

  return function (input) {
    var result = compose.apply(undefined, [fromIterable].concat(transforms))(input);
    if (typeof result === 'function') return toString(result);
    return result;
  };
});

var empty = function empty() {};
/**
 * Identity function that accepts one argument and returns the exact same argument.
 *
 * @param {T} x - Any value.
 * @return {T} The exact same result as `x`.
 */
var identity = function identity(x) {
  return x;
};
var truthy = function truthy() {
  return true;
};

var equal = function equal(x, y) {
  return x === y ? 0 : 1;
};
var not = function not(f, numOfParams) {
  switch (numOfParams) {
    case 0:
      return function () {
        return !f();
      };
    case 1:
      return function (a) {
        return !f(a);
      };
    case 2:
      return function (a, b) {
        return !f(a, b);
      };
    case 3:
      return function (a, b, c) {
        return !f(a, b, c);
      };
    default:
      return function () {
        return !f.apply(undefined, arguments);
      };
  }
};

var isArray = Array.isArray ||
/* istanbul ignore next */function (x) {
  return Object.prototype.toString.call(x) === '[object Array]';
};
var isString = function isString(x) {
  return typeof x === 'string' || x instanceof String;
};

var isNumber = function isNumber(x) {
  return x === +x;
};

var isFunction = function isFunction(x) {
  return typeof x === 'function';
};
var isLength = function isLength(value) {
  return isNumber(value) && value >= 0 && value % 1 === 0 && value < Infinity;
};
var isArrayLike = function isArrayLike(x) {
  return x != null && !isFunction(x) && isLength(x.length);
};

/**
 * Split elements into groups, where each group is an array with specified given `length`.
 * If elements are not able to be splitted evenly, the last group will contain the rest elements,
 * having `length` smaller or equal to specified size.
 *
 * @param {number} [size=1] size - length of each group (default value is 1)
 * Falsey or negative values will be treated as 0, and number will be coerced to integer.
 */
var chunk = function chunk() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  if (!size || size < 1) return function () {
    return truthy;
  };
  var sizeNum = Math.floor(size);
  return function (subscribe) {
    return (
      /**
       * @param {function(Array<any>,number):boolean} onNext - callback for receiving next element.
       * First param will be the group of elements, second param will be the current index of group.
       * Callback should return `false` if no longer interested in further elements.
       * @return {boolean} whether the iteration has terminated by accident
       */
      function (onNext) {
        var cache = [];
        var count = 0;
        var result = subscribe(function (element) {
          cache.push(element);
          if (cache.length >= sizeNum) {
            if (onNext(cache, count) === false) {
              return false;
            }
            count += 1;
            cache = [];
          }
          return true;
        });
        if (cache.length !== 0) return onNext(cache, count + 1);
        return result;
      }
    );
  };
};

/**
 * Keep elements that `predicate` returns truthy for.
 *
 * **[NOTICE]**: Elements passed `predicate` will be provided with a new `key` that starts from `0`.
 * To prevent the original `key`, `sequenz.pickBy` should be used instead.
 *
 * @param {function(any,any):boolean} predicate - The function invoked per iteration.
 */
var filter = function filter(predicate) {
  return function (subscribe) {
    return (
      /**
       * @param {function(any,any):boolean} onNext - Consumer that handles each element.
       * @return {boolean} Whether the iteration is terminated in middle.
       */
      function (onNext) {
        var count = -1;
        return subscribe(function (element, key) {
          if (predicate(element, key)) {
            count += 1;
            return onNext(element, count);
          }
          return true;
        });
      }
    );
  };
};

/**
 * Remove all falsey values.
 * In JavaScript, `false`, `null`, `undefined`, `0`, `''` and `NaN` are considered falsey values.
 */
var compact = function compact() {
  return filter(function (x) {
    return !!x;
  });
};

var just = (function (input) {
  return function (onNext) {
    return onNext(input, 0);
  };
});

// import fromPromise from './fromPromise';
var from = (function (input) {
  if (isArray(input) || isString(input)) return fromIterable(input);
  // else if (isPromise(input)) return fromPromise(input);
  else if (typeof input === 'function') return input; // assume it's sequenz already
  return just(input);
});

/**
 * Creates a new `sequenz` of values by running each element of given `sequenz` with `iteratee`,
 * while keeping the `key` unmodified. The `iteratee` is invoked with two arguments: `element` and
 * `key`.
 *
 * @param {function(any,any):any} iteratee - Function to create new `element`.
 */
var map = function map(iteratee) {
  return function (subscribe) {
    return function (onNext) {
      return subscribe(function (element, key) {
        return onNext(iteratee(element, key), key);
      });
    };
  };
};

/**
 * @param {...any} sequenzs - A list of elements, each will be iterated over and append to
 * original `sequenz`. If the given element is a function, it will be considered as a `sequenz`;
 * otherwise it will be converted to `sequenz` using `sequenz.from` method.
 */
var concat = function concat() {
  for (var _len = arguments.length, sequenzs = Array(_len), _key = 0; _key < _len; _key++) {
    sequenzs[_key] = arguments[_key];
  }

  return function (subscribe) {
    return function (onNext) {
      var subscriptions = [subscribe].concat(list(map(function (seq) {
        return typeof seq === 'function' ? seq : from(seq);
      }))(sequenzs));
      var count = -1;
      var subscriber = function subscriber(element) {
        count += 1;return onNext(element, count);
      };
      for (var i = 0; i < subscriptions.length; i += 1) {
        if (subscriptions[i](subscriber) === false) return false;
      }
      return true;
    };
  };
};

var findOrigin = (function () {
  var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  var fromIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return function (subscribe) {
    var startIndex = fromIndex ? Math.floor(+fromIndex) : 0;
    var result = { value: undefined, index: -1 };
    subscribe(function (element, i) {
      if (i >= startIndex && predicate(element, i)) {
        result = { value: element, index: i };
        return false;
      }
      return true;
    });
    return result;
  };
});

/**
 * Find the first index in sequenz where `predicate` returns true.
 *
 * @param {function(any,any):boolean} predicate - Predicate function to determine if value has been
 * found.
 * @param {number} fromIndex - Index to start searching.
 */
var findIndex = function findIndex(predicate, fromIndex) {
  return function (subscribe) {
    return findOrigin(predicate, fromIndex)(subscribe).index;
  };
};

var findLastOrigin = (function () {
  var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  var fromIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return function (subscribe) {
    var startIndex = fromIndex ? Math.floor(+fromIndex) : 0;
    var result = { value: undefined, index: -1 };
    subscribe(function (element, i) {
      if (i >= startIndex && predicate(element, i)) {
        result = { value: element, index: i };
      }
      return true;
    });
    return result;
  };
});

/**
 * Find the last index in sequenz where `predicate` returns true.
 *
 * @param {function(any,any):boolean} predicate - Predicate function to determine if value has been
 * found.
 * @param {number} fromIndex - Index to start searching.
 */
var findLastIndex = function findLastIndex(predicate, fromIndex) {
  return function (subscribe) {
    return findLastOrigin(predicate, fromIndex)(subscribe).index;
  };
};

/**
 * Gets the index at which the first occurrence of `value` is found in `sequenz`.
 *
 * @param {any} value - Value to search for.
 * @param {number} [fromIndex=0] - The index to search from. If index is negative number, it will be
 * used as offset from the end of `sequenz`.
 */
var indexOf = function indexOf(value) {
  var fromIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return fromIndex < 0 ? findLastIndex(function (x) {
    return x === value;
  }, -1 * fromIndex) : findIndex(function (x) {
    return x === value;
  }, fromIndex);
};

/**
 * Check whether the given value is contained in sequenz. Comparasion will be made using strict
 * equal `===`.
 *
 * @param {any} value - Value that should be used in search.
 * @param {number} fromIndex - Starting index for seaching.
 */
var contains = function contains(value) {
  var fromIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return function (subscribe) {
    return indexOf(value, fromIndex)(subscribe) >= 0;
  };
};

/**
 * Creates an object containing the key-value pairs, where keys are generated using given `iteratee`
 * and values are the total times each key is generated from elements in sequenz.
 *
 * By default, `identity` function is used as `iteratee`.
 *
 * @param {function(any):string} iteratee - Iteratee function to generate keys.
 */
var countBy = function countBy() {
  var iteratee = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  return function (subscribe) {
    var result = {};
    var mapFn = isFunction(iteratee) ? iteratee : function (element) {
      return element[iteratee.toString()];
    };
    subscribe(function (element) {
      var key = mapFn(element);
      result[key] = result[key] ? result[key] + 1 : 1;
    });
    return result;
  };
};

/**
 * Iterate over each element in `sequenz`
 *
 * @param {function(any,any):boolean} f - Callback that will be triggered for every element in
 * `sequenz`. Returning `false` will terminate the iteration.
 */
var each = function each(f) {
  return function (subscribe) {
    return subscribe(f);
  };
};

/* istanbul ignore next */function MapPolyfill() {
  this.str = {};
  this.num = {};
}

MapPolyfill.prototype.set /* istanbul ignore next */ = function add(key, value) {
  if (isString(key)) {
    this.str[key] = value;
    return;
  } else if (isNumber(key)) {
    this.num[key] = value;
    return;
  }
  if (!this.restKey) {
    this.restKey = [];this.restValue = [];
  }
  for (var i = 0; i < this.restKey.length; i += 1) {
    if (this.restKey[i] === key) {
      this.restValue[i] = value;
      return;
    }
  }
  this.restKey.push(key);
  this.restValue.push(value);
};

MapPolyfill.prototype.has /* istanbul ignore next */ = function has(key) {
  if (isString(key)) return this.str.hasOwnProperty(key);else if (isNumber(key)) return this.num.hasOwnProperty(key);else if (!this.restKey) return false;
  for (var i = 0; i < this.restKey.length; i += 1) {
    if (this.restKey[i] === key) return true;
  }
  return false;
};

MapPolyfill.prototype.get /* istanbul ignore next */ = function get(key) {
  if (isString(key)) return this.str[key];else if (isNumber(key)) return this.num[key];else if (!this.restKey) return undefined;
  for (var i = 0; i < this.restKey.length; i += 1) {
    if (this.restKey[i] === key) return this.restValue[i];
  }
  return undefined;
};

var Map$1 = typeof May === 'undefined' ? MapPolyfill : Map;

/* istanbul ignore next */function SetPolyfill() {
  this.map = new Map$1();
}

SetPolyfill.prototype.add /* istanbul ignore next */ = function add(key) {
  this.map.set(key, key);
};

SetPolyfill.prototype.has /* istanbul ignore next */ = function has(key) {
  return this.map.has(key);
};

var Set$1 = typeof Set === 'undefined' ? SetPolyfill : Set;

/**
 * High oder function that acts similarly as `sequenz.difference`, except that it first accepts an
 * iteratee function that will be used to map result values, before they get compared. The result
 * element will still be the original value.
 *
 * @param {function(any):any} [iteratee=identity] Iteratee function that will be used to calculate
 * value for comparation.
 */
var differenceBy = function differenceBy() {
  var iteratee = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  return function () {
    for (var _len = arguments.length, inputs = Array(_len), _key = 0; _key < _len; _key++) {
      inputs[_key] = arguments[_key];
    }

    var set = new Set$1();
    compose(from, each(function (input) {
      compose(from, each(function (element) {
        set.add(iteratee(element));
      }))(input);
    }))(inputs);
    return filter(function (x) {
      var element = iteratee(x);
      return !set.has(element);
    });
  };
};

/**
 * Create a sequenz of values that do not appear in other given arrays.
 *
 * @param {...Array} inputs - The values to exclude. If given is not array, it will be converted to
 * based on implementation of `sequenz.from`.
 */
var difference = differenceBy(identity);

/**
 * Check if `predicate` returns truthy for **all** elements of given `sequenz`. Iteration will stops
 * once `predicate` returns falsey. The `predicate` is invoked with two arguments: (value, key).
 *
 * @param {function(any,any):boolean} [predicate=identity] The function invoked per iteration.
 */
var every = function every() {
  var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  return function (subscribe) {
    var result = true;
    subscribe(function (element, key) {
      if (!predicate(element, key)) {
        result = false;
      }
      return result;
    });
    return result;
  };
};

/**
 * Reduce a `sequenz` to one final value by applying the `iteratee` against an accumulator and each
 * element in `sequenz`.
 *
 * @param {function(any,any,any):any} iteratee - Function to execute on each value in the `sequenz`,
 * taking three arguments: **accumulator**, **current value** and **current index**
 * @param {?any} initial - Value to use as the first accumulator. If not provided, the first element
 * will be used as initial value instead (`iteratee` will not be called for first element in this
 * case then).
 */
var reduce = function reduce(iteratee, initial) {
  if (arguments.length === 1) {
    // eslint-disable-line prefer-rest-params
    return function (subscribe) {
      var result = void 0;
      var hasInitial = false;
      subscribe(function (element, key) {
        if (!hasInitial) {
          hasInitial = true;
          result = element;
        } else {
          result = iteratee(result, element, key);
        }
      });
      return result;
    };
  }
  return function (subscribe) {
    var result = initial;
    subscribe(function (element, key) {
      result = iteratee(result, element, key);
    });
    return result;
  };
};

/**
 * High oder function that acts similarly as `sequenz.difference`, except that it first accepts a
 * customized comparator function that will be used to compara values.
 *
 * @param {function(any,any):number} [comparator=equal] Comparator function that will be used to
 * compara alues. Comparator should return `0` when two values are equal.
 */
var differenceWith = function differenceWith(comparator) {
  if (comparator === undefined) return difference;
  return function () {
    for (var _len = arguments.length, inputs = Array(_len), _key = 0; _key < _len; _key++) {
      inputs[_key] = arguments[_key];
    }

    var values = list(map(function (input) {
      if (isArray(input)) return input;
      return compose(from, toList)(input);
    }), reduce(function (ret, input) {
      return ret.concat(input);
    }))(inputs);
    return filter(function (x) {
      return list(every(function (y) {
        return comparator(x, y) !== 0;
      }))(values);
    });
  };
};

/**
 * Continously ignore elements at front, if `predicate` returns thruthy.
 *
 * @param {function(any,any):boolean} predicate - Whether the element at front should be ignored.
 * This function will not be called when first element results in falsey.
 */
var skipWhile = function skipWhile(predicate) {
  return function (subscribe) {
    return function (onNext) {
      var shouldSkip = true;
      var count = -1;
      return subscribe(function (element, key) {
        if (shouldSkip && predicate(element, key)) return true;
        shouldSkip = false;
        count += 1;
        return onNext(element, count);
      });
    };
  };
};

/**
 * Skip first given number of elements.
 *
 * @param {number} num - Number of elements should be ignored.
 */
var skip$1 = function skip$1() {
  var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  if (!num) return identity; // do not drop any element
  var n = Math.floor(num);
  return skipWhile(function (_, i) {
    return i < n;
  });
};

/**
 * Skip given number of elements at the end of sequenz.
 *
 * @param {number} num - Number of elements that should be skipped at the end.
 */
var skipRight$1 = function skipRight$1() {
  var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  if (num < 1) return identity;
  if (num === Infinity) return function () {
    return truthy;
  };
  var n = Math.floor(num);
  var cache = new Array(n);
  var count = -1;
  var result = true;
  var idx = -1;
  return function (subscribe) {
    return function (onNext) {
      return subscribe(function (element) {
        count += 1;
        idx = count % n;
        if (count >= n) {
          result = onNext(cache[idx], count);
        }
        cache[idx] = element;
        return result;
      });
    };
  };
};

/**
 * Skip some elements at the end, where each results in truthy value from `predicate` function.
 * These elements should be continuous one after another.
 *
 * @param {function(any,any):boolean} predicate - Whether element should be ignored.
 */
var skipRightWhile$1 = function skipRightWhile$1() {
  var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;

  var cache = [];
  var count = -1;
  return function (subscribe) {
    return function (onNext) {
      var doNext = function doNext(element) {
        count += 1;return onNext(element, count);
      };
      return subscribe(function (element, key) {
        if (predicate(element, key)) {
          cache.push(element);
          return true;
        }
        if (cache.length > 0) {
          fromIterable(cache)(doNext);
          cache = [];
        }
        return doNext(element);
      });
    };
  };
};

/**
 * Fills elements in a `sequenz` with given `value` from `start` up to, but not including, `end`.
 *
 * **[NOTICE]**: The `sequenz` should have keys that are `number`s, as key will be used to compare
 * if given element should be replaced by `value`.
 *
 * @param {any} value - Value to fill
 * @param {number} [start=0] - Start index
 * @param {number} [end=Infinity] - End index
 */
var fill = function fill(value, start, end) {
  if (start === undefined && end === undefined) {
    return function (subscribe) {
      return function (onNext) {
        return subscribe(function (_, key) {
          return onNext(value, key);
        });
      };
    };
  }
  var startIdx = !start ? 0 : Math.floor(+start);
  var endIdx = void 0;
  if (end === undefined) endIdx = Infinity;else if (!end) endIdx = 0;else endIdx = Math.floor(+end);
  return function (subscribe) {
    return function (onNext) {
      return subscribe(function (_, key) {
        if (startIdx <= key && endIdx > key) return onNext(value, key);
        return onNext(_, key);
      });
    };
  };
};

/**
 * Find the first value where `predicate` returns true.
 *
 * @param {function(any,any):boolean} predicate - Predicate function to determine if value has been
 * found.
 * @param {number} fromIndex - Index to start searching.
 */
var find = function find(predicate, fromIndex) {
  return function (subscribe) {
    return findOrigin(predicate, fromIndex)(subscribe).value;
  };
};

/**
 * Find the last value where `predicate` returns true.
 *
 * @param {function(any,any):boolean} predicate - Predicate function to determine if value has been
 * found.
 * @param {number} fromIndex - Index to start searching.
 */
var findLast = function findLast(predicate, fromIndex) {
  return function (subscribe) {
    return findLastOrigin(predicate, fromIndex)(subscribe).value;
  };
};

/**
 * Return the first element or `defaultValue` if sequenz is empty.
 *
 * @param {any} defaultValue - Value that will be returned if sequenz is empty.
 */
var firstOrDefault = function firstOrDefault(defaultValue) {
  return function (subscribe) {
    var ret = defaultValue;
    subscribe(function (element) {
      ret = element;return false;
    });
    return ret;
  };
};

/**
 * Find the first value in sequenz. `undefined` will be returned if sequenz is empty.
 */
var first = function first() {
  return firstOrDefault(undefined);
};

var isMatch = function isMatch(properties) {
  return function (obj) {
    for (var key in properties) {
      // eslint-disable-line no-restricted-syntax
      if (!Object.prototype.hasOwnProperty.call(obj, key) || properties[key] !== obj[key]) {
        return false;
      }
    }
    return true;
  };
};

/**
 * Looks through each element in `sequenz` and returns all elements that contains the given
 * key-value pairs specified in `properties`.
 *
 * @param {object} properties - Key-value pairs.
 */
var where = function where(properties) {
  return filter(isMatch(properties));
};

/**
 * Find the first value in sequenz where it matches the given `properties`. Internally, this API
 * uses `where` to look for matched value.
 *
 * @param {object} properties - Key-pair values that should be used for searching.
 */
var findWhere = function findWhere(properties) {
  return compose(where(properties), first());
};

/**
 * Recursively flatten elements in `sequenz` up to `depth` times.
 *
 * @param {number} [depth=1] the maximum recursion depth.
 */
var flattenDepth = function flattenDepth() {
  var depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  var depthNum = Math.floor(depth);
  return function (subscribe) {
    return function (onNext) {
      var count = -1;
      var doNext = function doNext(element) {
        count += 1;return onNext(element, count);
      };
      var recursiveSubscribe = function recursiveSubscribe(sub, currentDepth) {
        return sub(function (element) {
          if (isArrayLike(element) && !isString(element) && currentDepth < depthNum) {
            return recursiveSubscribe(fromIterable(element), currentDepth + 1);
          }
          return doNext(element);
        });
      };
      return recursiveSubscribe(subscribe, 0);
    };
  };
};

/**
 * Flatten elements in `sequenz` one level deep.
 */
var flatten = function flatten() {
  return flattenDepth(1);
};

/**
 * Flatten elements in `sequenz` as much as possible.
 */
var flattenDeep = function flattenDeep() {
  return flattenDepth(Infinity);
};

var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var fromPairs = (function () {
  return function (subscribe) {
    var result = {};
    subscribe(function (_ref) {
      var _ref2 = slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      result[key] = value;
    });
    return result;
  };
});

/**
 * Keep only the elements that `predicate` returns true. Unlike `filter` API, this API will keep the
 * origin `key` value unchanged.
 *
 * @param {function(any,any):boolean} predicate - Check if value should be kept or ignored.
 */
var pickBy = function pickBy(predicate) {
  return function (subscribe) {
    return function (onNext) {
      return subscribe(function (element, key) {
        if (predicate(element, key)) return onNext(element, key);
        return true;
      });
    };
  };
};

/**
 * Filter sequenz to only keep elements that are functions. Key values will be kept in this API.
 * Internally, it uses `pickBy`.
 */
var functions = function functions() {
  return pickBy(isFunction);
};

/**
 * Group elements in sequenz into different groups, each has a uniq `key` generated by `iteratee`.
 * The result of this API is a new sequenz containing the key-value pairs, where value is a list of
 * all elements that sharing the same `key`. Considering each `value` as an internal sequenz, a
 * second param can be passed in. This param will be used to generate a sequenz transformer that is
 * applied to each internal sequenz. It can be used to pick up only the required elements, and
 * terminate the sequenz iteration as soon as possible.
 *
 * @param {function(any,any):string|string} iteratee - Use to calculate the `key` value out of each
 * element. If a string is given, it will be used as the property name to get `key` from each
 * element.
 * @param {function(string):function} transformGen - Function that will generate transformer using
 * given `key`. If not provided, no transform will be applied to each internal sequenz.
 */
var groupBy = function groupBy(iteratee) {
  var transformGen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : empty;

  var mapFn = isString(iteratee) ? function (element) {
    return element[iteratee];
  } : iteratee;
  return function (subscribe) {
    return function (onNext) {
      var pipeline = {};
      var result = {};
      var total = 0;
      subscribe(function (element, i) {
        var key = mapFn(element, i);
        if (pipeline[key] === undefined) {
          var transform = transformGen(key);
          total += 1;
          pipeline[key] = function (internalSubscribe) {
            var receiveNext = void 0;
            var count = -1;
            /*
             * `intervalSubscribe` returns too early, even before any element has been consumed.
             * However, since it returns a reference (i.e. an array), this reference will not be
             * changed when later more elements have been added.
             * Thus, just need to cache the `onNext` function `toList` used, so that elements later
             * can continously push in.
             *
             * This is quite a tricky implementation, as it uses sync solution to handle async
             * scenario.
             */
            result[key] = internalSubscribe(function (internalOnNext) {
              receiveNext = internalOnNext;
            });
            return function (value) {
              count += 1;
              if (receiveNext(value, count) === false) {
                total -= 1;
                pipeline[key] = null;
              }
            };
          }(transform ? compose(transform, toList) : toList);
        }
        if (pipeline[key]) pipeline[key](element);
        return total !== 0;
      });
      return fromObject(result)(onNext);
    };
  };
};

/**
 * Consume the `sequenz`, use `iteratee` to generate `key` for each element, and returns an object
 * with an index of each element.
 *
 * @param {function(any):string|string} iteratee - Function that returns the `key` of each element,
 * or `property` string that will be used to get `key` from each element.
 */
var indexBy = function indexBy(iteratee) {
  var mapFn = isString(iteratee) ? function (element) {
    return element[iteratee];
  } : iteratee;
  return function (subscribe) {
    return reduce(function (previous, element) {
      var key = mapFn(element);
      if (process.env.NODE_ENV !== 'production' && Object.prototype.hasOwnProperty.call(previous, key)) {
        console.warn('[WARNING]: `indexBy` assumes each key to be uniq. However, ' + key + ' is duplicated.');
      } else {
        previous[key] = element; // eslint-disable-line no-param-reassign
      }
      return previous;
    }, {})(subscribe);
  };
};

/**
 * Creates a new `sequenz` with all but the last element of given `sequenz`.
 */
var initial = function initial() {
  return skipRight$1(1);
};

/**
 * Invokes method with intermediate value, while keeping the value unchanged.
 *
 * @param {function(any,any):void} f - Invoked on every intermediate value, while the return of each
 * call is omitted.
 */
var intercept = function intercept(f) {
  return function (subscribe) {
    return function (onNext) {
      return subscribe(function (element, key) {
        f(element, key);
        return onNext(element, key);
      });
    };
  };
};

/**
 * High oder function that acts similarly as `sequenz.intersection`, except that it first accepts an
 * iteratee function that will be used to map result values, before they get compared. The result
 * element will still be the original value.
 *
 * @param {function(any):any} [iteratee=identity] Iteratee function that will be used to calculate
 * value for comparation.
 */
var intersectionBy = function intersectionBy() {
  var iteratee = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  return function () {
    for (var _len = arguments.length, inputs = Array(_len), _key = 0; _key < _len; _key++) {
      inputs[_key] = arguments[_key];
    }

    var map = new Map$1();
    var length = inputs.length;
    compose(from, each(function (input) {
      compose(from, each(function (x) {
        var element = iteratee(x);
        if (!map.has(element)) {
          map.set(element, 1);
        } else {
          map.set(element, map.get(element) + 1);
        }
      }))(input);
    }))(inputs);
    return filter(function (x) {
      var element = iteratee(x);
      return map.get(element) === length;
    });
  };
};

/**
 * Create a sequenz of values that only appears in ALL other given arrays.
 *
 * @param {...Array} inputs - The values to include. If given is not array, it will be converted to
 * based on implementation of `sequenz.from`.
 */
var intersection = intersectionBy(identity);

/**
 * High oder function that acts similarly as `sequenz.intersection`, except that it first
 * accepts a customized comparator function that will be used to compara values.
 *
 * @param {function(any,any):number} [comparator=equal] Comparator function that will be used to
 * compara alues. Comparator should return `0` when two values are equal.
 */
var intersectionWith = function intersectionWith(comparator) {
  if (comparator === undefined) return intersection;
  return function () {
    for (var _len = arguments.length, inputs = Array(_len), _key = 0; _key < _len; _key++) {
      inputs[_key] = arguments[_key];
    }

    var length = inputs.length;
    var values = list(map(function (input) {
      if (isArray(input)) return input;
      return compose(from, toList)(input);
    }), reduce(function (ret, input) {
      return ret.concat(input);
    }))(inputs);
    return filter(function (x) {
      return list(filter(function (y) {
        return comparator(x, y) === 0;
      }))(values).length === length;
    });
  };
};

/**
 * Creates a new `sequenz` where element and key are key and element in previous `sequenz`
 * respectively.
 */
var invert = function invert() {
  return function (subscribe) {
    return function (onNext) {
      return subscribe(function (element, key) {
        return onNext(key, element);
      });
    };
  };
};

/**
 * Convert `sequenz` to a string separated by specfied `separator`.
 *
 * @param {string} [separator=","] String to separate each element
 */
var join = function join() {
  var separator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ',';
  return function (subscribe) {
    return toList(subscribe).join(separator);
  };
};

/**
 * Creates a new `sequenz` where `element` is the `key` in previous `sequenz` and it's index as the
 * new `key`.
 */
var keys = function keys() {
  return function (subscribe) {
    return function (onNext) {
      var count = -1;
      return subscribe(function (_, key) {
        count += 1;
        onNext(key, count);
      });
    };
  };
};

/**
 * Gets the last element of `sequenz` or use `defaultValue` if `sequenz` is empty.
 *
 * @param {any} defaultValue - Value that will be used if `sequenz` is empty
 */
var lastOrDefault = function lastOrDefault(defaultValue) {
  return function (subscribe) {
    var value = defaultValue;
    subscribe(function (element) {
      value = element;
    });
    return value;
  };
};

/**
 * Gets the last element of `sequenz`. `undefined` will be provided if `sequenz` is empty.
 */
var last = function last() {
  return lastOrDefault(undefined);
};

/**
 * Gets the index at which the last occurrence of `value` is found in `sequenz`.
 *
 * @param {any} value - Value to search for.
 * @param {number} [fromIndex=0] - The index to search from. Unlike `sequenz.indexOf`, index must be
 * non-negative.
 */
var lastIndexOf = function lastIndexOf(value) {
  var fromIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return findLastIndex(function (x) {
    return x === value;
  }, fromIndex);
};

/**
 * Logs each intermediate element and it's key
 */
var log = function log() {
  return intercept(function (element, key) {
    console.log(element, key);
  });
};

/**
 * Computes the maximum value of `sequenz`, where rank of each element is calculated using
 * given `iteratee`. If `sequenz` is empty, `undefined` will be returned.
 *
 * @param {function(any,any):number} [iteratee=identity] Function that used to calculate rank of
 * each element. The rank will then be used to determine the maximum element in `sequenz`.
 */
var max = function max() {
  var iteratee = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  return function (subscribe) {
    var found = false;
    var ret = reduce(function (result, num, key) {
      var rank = iteratee(num, key);
      if (!isNumber(rank)) return result;
      found = true;
      if (result.rank < rank) {
        return { rank: rank, value: num };
      }
      return result;
    }, { rank: -Infinity, value: -Infinity })(subscribe);
    if (found) return ret.value;
    return undefined;
  };
};

/**
 * Computes the minimum value of `sequenz`, where rank of each element is calculated using
 * given `iteratee`. If `sequenz` is empty, `undefined` will be returned.
 *
 * @param {function(any,any):number} [iteratee=identity] Function that used to calculate rank of
 * each element. The rank will then be used to determine the minimum element in `sequenz`.
 */
var min = function min() {
  var iteratee = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  return function (subscribe) {
    var found = false;
    var ret = reduce(function (result, num, key) {
      var rank = iteratee(num, key);
      if (!isNumber(rank)) return result;
      found = true;
      if (result.rank > rank) {
        return { rank: rank, value: num };
      }
      return result;
    }, { rank: Infinity, value: Infinity })(subscribe);
    return found ? ret.value : undefined;
  };
};

/**
 * Take given number of elements counting from right hand side of sequenz.
 *
 * [NOTICE]: This API needs to first iterate over ALL elements in sequenz to produce a new sequenz
 * containing only the required elements.
 *
 * @param {number} num - Number of elements to receive.
 */
var takeRight = function takeRight() {
  var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  return function (subscribe) {
    return function (onNext) {
      var length = Math.floor(num) || 0;
      if (length < 1) return true;
      var cache = length > 200 ? [] : new Array(length);
      var index = -1;
      var hasMoreThanNecessary = false;
      var doNext = function doNext(start, end, shift) {
        for (var i = start; i < end; i += 1) {
          if (onNext(cache[i], i - shift) === false) return false;
        }
        return true;
      };
      subscribe(function (element) {
        index += 1;
        if (hasMoreThanNecessary || index >= length) hasMoreThanNecessary = true;
        cache[index % length] = element;
      });
      if (!hasMoreThanNecessary) {
        return doNext(0, index + 1, 0);
      }
      var shift = (index + 1) % length;
      if (doNext(shift, length, shift) === false) return false;
      return doNext(0, shift, shift - length);
    };
  };
};

/**
 * Find the nth element in sequenz. `undefined` will be returned if sequenz does not have `n`
 * elements.
 *
 * @param {number} n - Index for element. If negative number is provided, it will be count from
 * right to left.
 */
var nth = function nth() {
  var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  if (n >= 0) return compose(skip$1(n - 1), first());
  return compose(takeRight(n * -1), first());
};

/**
 * Group key and element into an array [key, element].
 */
var pairs = function pairs() {
  return function (subscribe) {
    return function (onNext) {
      var count = -1;
      return subscribe(function (element, key) {
        count += 1;
        return onNext([key, element], count);
      });
    };
  };
};

/**
 * Split sequenz into two part, one containing only the sequenz that `predicate` returns truthy
 * result, the other containing only the sequenz that results in falsey value.
 *
 * @param {function(any,any):boolean} predicate - Function to map each element to boolean result.
 * @param {function(string):function} transformGen - Function to generate transformers. More info
 * can be found in `groupBy` API.
 */
var partition = function partition(predicate, transformGen) {
  return groupBy(function (element, i) {
    return predicate(element, i) ? 'truthy' : 'falsey';
  }, transformGen);
};

/**
 * Extracts specified `property` out of each element and construct a new `sequenz`. The `key` will
 * remain the same.
 *
 * @param {string} propertyName - Name of property.
 */
var pluck = function pluck(propertyName) {
  return map(function (element) {
    return element[propertyName];
  });
};

/**
 * Generate a new `sequenz` depends on given range parameters.
 *
 * + If no param is provided, it will generate an infinite `sequenz` that requires manual stop.
 * + If one param is provided, it will be used as `stop` index.
 * + If two params are provided, it will be used as `start` and `stop` index.
 * + If three params are provided, it will be used as `start`, `stop` and `step`.
 *
 * @param {?number} start - Start index of range.
 * @param {?number} stop - Stop index (exclude) of range.
 * @param {?number} step - Step size of each iteration.
 */
var range = function range() {
  var start = 0;
  var stop = void 0;
  var step = 1;
  /* eslint-disable prefer-rest-params */
  if (arguments.length === 0) stop = Infinity;else if (arguments.length === 1) stop = arguments[0];else if (arguments.length === 2) {
    start = arguments[0];
    stop = arguments[1];
  } else {
    start = arguments[0];
    stop = arguments[1];
    step = arguments[2];
  }
  return function (onNext) {
    for (var i = start, count = 0; i < stop; i += step, count += 1) {
      if (onNext(i, count) === false) return false;
    }
    return true;
  };
};

/**
 * Remove all elements in `sequenz` where `predicate` returns truthy. This function acts exact the
 * opposite of `sequenz.filter` function.
 *
 * @param {function(any,any):boolean} predicate - Function that returns truthy or falsey for each
 * element in `sequenz`.
 */
var remove$1 = function remove$1() {
  var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  return filter(not(predicate, 2));
};

/**
 * Generate a new `sequenz` which will repeat element specified times.
 *
 * @param {any} element - Element to be provided.
 * @param {number} times - Total time that the element should be provided.
 * @return {boolean} Whether the `sequenz` is terminated manually.
 */
var repeat = function repeat(element) {
  var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return function (onNext) {
    if (times < 1) return true;
    var bound = Math.floor(times);
    for (var i = 0; i < bound; i += 1) {
      if (onNext(element, i) === false) return false;
    }return true;
  };
};

/**
 * Reverse the `sequenz` and provide new key to each element, which is the new order index of each
 * element, starting from `0`.
 */
var reverse = function reverse() {
  return function (subscribe) {
    return function (onNext) {
      var result = toList(subscribe);
      var length = result.length;
      for (var i = length - 1; i >= 0; i -= 1) {
        if (onNext(result[i], length - i - 1) === false) return false;
      }
      return true;
    };
  };
};

/**
 * Accumulate a `sequenz` to create a new `sequenz` by applying the `iteratee` against an
 * accumulator and each element in `sequenz`, the result of each element will form the new
 * `sequenz`.
 *
 * @param {function(any,any,any):any} iteratee - Function to execute on each value in the `sequenz`,
 * taking three arguments: **accumulator**, **current value** and **current index**
 * @param {?any} initial - Value to use as the first accumulator. If not provided, the first element
 * will be used as initial value instead (`iteratee` will not be called for first element in this
 * case then).
 */
var scan = function scan(iteratee, initial) {
  var hasPrevious = arguments.length > 1; // eslint-disable-line prefer-rest-params
  return function (subscribe) {
    return function (onNext) {
      var previous = initial;
      return subscribe(function (element, key) {
        if (!hasPrevious) {
          hasPrevious = true;
          previous = element;
          return onNext(element, key);
        }
        previous = iteratee(previous, element, key);
        return onNext(previous, key);
      });
    };
  };
};

/**
 * Gets the size of a `sequenz`.
 */
var size = function size() {
  return function (subscribe) {
    return reduce(function (count) {
      return count + 1;
    }, 0)(subscribe);
  };
};

/**
 * Take elements as long as each of then result in truthy value from `predicate`.
 *
 * @param {function(any,any):boolean} predicate - Determine whether a value should be kept.
 */
var takeWhile = function takeWhile() {
  var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  return function (subscribe) {
    return function (onNext) {
      return subscribe(function (element, key) {
        if (predicate(element, key)) return onNext(element, key);
        return false;
      });
    };
  };
};

/**
 * Take given number of elements in sequenz.
 *
 * @param {number} num - Number of elements to take in sequenz.
 */
var take = function take() {
  var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  return takeWhile(function (_, idx) {
    return idx < num;
  });
};

/**
 * Creates a slice of `sequenz` from `start` up to, but not including, `end`
 *
 * @param {number} [start=0] Start index.
 * @param {number} [end=Infinity] End index.
 */
var slice = function slice() {
  var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
  return compose(start >= 0 ? skip$1(start) : takeRight(-1 * start), end >= 0 ? take(end - start) : skipRight$1(-1 * end));
};

/**
 * Check if `predicate` returns truthy for **any** elements of given `sequenz`. Iteration will stops
 * once `predicate` returns truthy. The `predicate` is invoked with two arguments: (value, key).
 *
 * @param {function(any,any):boolean} [predicate=identity] The function invoked per iteration.
 */
var some = function some() {
  var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  return function (subscribe) {
    return !every(not(predicate, 2))(subscribe);
  };
};

/**
 * Creates a duplicated free `sequenz`.
 *
 * **[NOTICE]**: This transformer assumes the `sequenz` is sorted already.
 *
 * @param {function(any,any):any} iteratee - Function to convert element before comparasion.
 */
var sortedUniqBy = function sortedUniqBy(iteratee) {
  return function (subscribe) {
    return function (onNext) {
      var previous = void 0;
      var count = -1;
      return subscribe(function (element, key) {
        var item = iteratee(element, key);
        if (count >= 0 && previous === item) return true;
        count += 1;
        previous = item;
        return onNext(element, count);
      });
    };
  };
};

/**
 * Creates a duplicated free `sequenz`.
 *
 * **[NOTICE]**: This transformer assumes the `sequenz` is sorted already.
 */
var sortedUniq = function sortedUniq() {
  return sortedUniqBy(identity);
};

/**
 * Creates a new `sequenz` with all elements except the first one.
 */
var tail = function tail() {
  return skip$1(1);
};

/**
 * Take elements from right hand side as long as the elements result in truthy value from
 * `predicate`.
 *
 * @param {function(any,any):boolean} predicate - Predicate function to check each element.
 */
var takeRightWhile = function takeRightWhile() {
  var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  return function (subscribe) {
    return function (onNext) {
      var cache = [];
      subscribe(function (element, i) {
        if (predicate(element, i)) cache.push(element);else if (cache.length !== 0) cache = [];
        return true;
      });
      return fromIterable(cache)(onNext);
    };
  };
};

/**
 * This method is like `sequenz.uniq`, except that it accepts `iteratee` which is invoked for each
 * element in sequenz to generate the criterion by which uniqueness is computed. The order is
 * determined by the order they occur in the array.
 *
 * The iteratee is invoked with one argument: `value`.
 *
 * @param {function(any):any} iteratee - Iteratee invoked for each element.
 */
var uniqBy = function uniqBy() {
  var iteratee = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;

  var set = new Set$1();
  return filter(function (x) {
    var element = iteratee(x);
    var result = set.has(element);
    if (result) return false;
    set.add(element);
    return true;
  });
};

/**
 * High oder function that acts similarly as `sequenz.union`, except that it first accepts an
 * iteratee function that will be used to map result values, before they get compared. The result
 * element will still be the original value.
 *
 * @param {function(any):any} [iteratee=identity] Iteratee function that will be used to calculate
 * value for comparation.
 */
var unionBy = function unionBy() {
  var iteratee = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  return function () {
    for (var _len = arguments.length, inputs = Array(_len), _key = 0; _key < _len; _key++) {
      inputs[_key] = arguments[_key];
    }

    var values = list(map(function (input) {
      if (isArray(input)) return input;
      return compose(from, toList)(input);
    }), reduce(function (prev, curr) {
      return prev.concat(curr);
    }))(inputs);
    return compose(concat(values), uniqBy(iteratee));
  };
};

/**
 * Create a sequenz of values that only appears in ANY given array or sequenz, each element will
 * only appear once.
 *
 * @param {...Array} inputs - The values to include. If given is not array, it will be converted to
 * based on implementation of `sequenz.from`.
 */
var union = unionBy(identity);

/**
 * This method is like `sequenz.uniq`, except that it accepts `comparator` which is invoked for each
 * element in sequenz to compare with all previous elements. The `comparator` will only provides `0`
 * if two elements are considered equal.
 *
 * @param {function(any,any):number} comparator - Comparator invoked for comparing elements, returns
 * `0` if two elements are equal.
 */
var uniqWith = function uniqWith() {
  var comparator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : equal;
  return function (subscribe) {
    var cache = [];
    return function (onNext) {
      return subscribe(function (element) {
        if (list(some(function (value) {
          return comparator(value, element) === 0;
        }))(cache)) return true;
        cache.push(element);
        return onNext(element, cache.length - 1);
      });
    };
  };
};

/**
 * High oder function that acts similarly as `sequenz.union`, except that it first
 * accepts a customized comparator function that will be used to compara values.
 *
 * @param {function(any,any):number} [comparator=equal] Comparator function that will be used to
 * compara alues. Comparator should return `0` when two values are equal.
 */
var unionWith = function unionWith() {
  var comparator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : equal;
  return function () {
    for (var _len = arguments.length, inputs = Array(_len), _key = 0; _key < _len; _key++) {
      inputs[_key] = arguments[_key];
    }

    var values = list(map(function (input) {
      if (isArray(input)) return input;
      return compose(from, toList)(input);
    }), reduce(function (prev, curr) {
      return prev.concat(curr);
    }))(inputs);
    return compose(concat(values), uniqWith(comparator));
  };
};

/**
 * Creates a duplicate-free version of an array. The order of result values is determined by The
 * order they occur in the array.
 */
var uniq = function uniq() {
  return uniqBy(identity);
};

/**
 * Create a new sequenz containing lists, where nth list in new sequenz containing all nth values
 * in each element from previous sequenz. The `length` will be decided using the `length` of first
 * element in previous sequenz. It will be considered as a single element list, if element is not
 * an array.
 * @param {function(number):function} transformGen - Function that will generate transformer using
 * given `index`. If not provided, no transform will be applied to each internal sequenz.
 */
var unzip = function unzip(transformGen) {
  return function (subscribe) {
    return function (onNext) {
      var result = [];
      var pipeline = void 0;
      var count = 0;
      subscribe(function (element, i) {
        var arr = [].concat(element);
        if (!pipeline) {
          if (arr.length === 0) return false;
          pipeline = list(map(function (ele, index) {
            return function (internalSubscribe) {
              var cache = void 0;
              result[index] = internalSubscribe(function (internalOnNext) {
                cache = internalOnNext;
              });
              return function (value, key, pipelineIndex) {
                if (cache(value, key) === false) {
                  pipeline[pipelineIndex] = null;
                  count -= 1;
                }
              };
            }(transformGen ? compose(transformGen(index), toList) : toList);
          }))(arr);
          count = pipeline.length;
        }
        each(function (f, index) {
          if (!f) return;
          f(arr[index], i, index);
        })(fromIterable(pipeline));
        return count !== 0;
      });
      return fromIterable(result)(onNext);
    };
  };
};

/**
 * Create a sequenz excluding all passed in values via parameters.
 *
 * @param {...any} values - Values that should be excluded.
 */
var without = function without() {
  for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  return difference(values);
};

/**
 * Zip existing arrays with sequenz. Each element in new created sequenz will be an array,
 * containing elements from existing arrays and sequenz, where first element will be from
 * sequenz, the rest will be from existing arrays, with order kept.
 *
 * @param {...any[]} inputs - list of arrays.
 */
var zip = function zip() {
  for (var _len = arguments.length, inputs = Array(_len), _key = 0; _key < _len; _key++) {
    inputs[_key] = arguments[_key];
  }

  return function (subscribe) {
    return function (onNext) {
      return subscribe(function (element, i) {
        var result = [element].concat(list(map(function (input) {
          return input[i];
        }))(inputs));
        return onNext(result, i);
      });
    };
  };
};

/**
 * This method is similar as `fromPairs` except that the first param here is an array of pre-defined
 * keys.
 *
 * @param {string[]} keys - An array of keys
 */
var zipObject = function zipObject(keys) {
  return function (subscribe) {
    return function (onNext) {
      return subscribe(function (element, i) {
        return keys.length > i ? onNext(element, keys[i]) : false;
      });
    };
  };
};

/* ---------- Helpers ---------- */

/* ---------- Transforms ---------- */

exports.list = list;
exports.object = object;
exports.string = string;
exports.fromObject = fromObject;
exports.fromIterable = fromIterable;
exports.toList = toList;
exports.toObject = toObject;
exports.toString = toString;
exports.chunk = chunk;
exports.compact = compact;
exports.concat = concat;
exports.contains = contains;
exports.countBy = countBy;
exports.difference = difference;
exports.differenceBy = differenceBy;
exports.differenceWith = differenceWith;
exports.drop = skip$1;
exports.dropRight = skipRight$1;
exports.dropRightWhile = skipRightWhile$1;
exports.dropWhile = skipWhile;
exports.each = each;
exports.every = every;
exports.fill = fill;
exports.find = find;
exports.findIndex = findIndex;
exports.findLast = findLast;
exports.findLastIndex = findLastIndex;
exports.filter = filter;
exports.first = first;
exports.firstOrDefault = firstOrDefault;
exports.findWhere = findWhere;
exports.flatten = flatten;
exports.flattenDeep = flattenDeep;
exports.flattenDepth = flattenDepth;
exports.forEach = each;
exports.fromPairs = fromPairs;
exports.functions = functions;
exports.groupBy = groupBy;
exports.head = first;
exports.indexBy = indexBy;
exports.indexOf = indexOf;
exports.initial = initial;
exports.intercept = intercept;
exports.intersection = intersection;
exports.intersectionBy = intersectionBy;
exports.intersectionWith = intersectionWith;
exports.invert = invert;
exports.join = join;
exports.keys = keys;
exports.last = last;
exports.lastIndexOf = lastIndexOf;
exports.lastOrDefault = lastOrDefault;
exports.log = log;
exports.map = map;
exports.max = max;
exports.min = min;
exports.nth = nth;
exports.pairs = pairs;
exports.partition = partition;
exports.pickBy = pickBy;
exports.pluck = pluck;
exports.range = range;
exports.reduce = reduce;
exports.reject = remove$1;
exports.remove = remove$1;
exports.repeat = repeat;
exports.reverse = reverse;
exports.scan = scan;
exports.size = size;
exports.slice = slice;
exports.skip = skip$1;
exports.skipRight = skipRight$1;
exports.skipRightWhile = skipRightWhile$1;
exports.skipWhile = skipWhile;
exports.some = some;
exports.sortedUniq = sortedUniq;
exports.sortedUniqBy = sortedUniqBy;
exports.tail = tail;
exports.take = take;
exports.takeRight = takeRight;
exports.takeRightWhile = takeRightWhile;
exports.takeWhile = takeWhile;
exports.union = union;
exports.unionBy = unionBy;
exports.unionWith = unionWith;
exports.uniq = uniq;
exports.uniqBy = uniqBy;
exports.uniqWith = uniqWith;
exports.unzip = unzip;
exports.where = where;
exports.without = without;
exports.zip = zip;
exports.zipObject = zipObject;

Object.defineProperty(exports, '__esModule', { value: true });

})));
