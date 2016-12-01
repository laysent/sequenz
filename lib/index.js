'use strict';

var babelHelpers = {};

babelHelpers.slicedToArray = function () {
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

babelHelpers;

var compose = (function () {
  for (var _len = arguments.length, transforms = Array(_len), _key = 0; _key < _len; _key++) {
    transforms[_key] = arguments[_key];
  }

  return function (input) {
    return transforms.reduce(function (prev, curr) {
      return curr(prev);
    }, input);
  };
})

/**
 * convert iterable to sequence. Iterable should contain `length` and should be able to get each
 * element via `[i]`.
 *
 * @param {array|string} input - Iterable. Normally should be either string or array.
 * @return {function} function to receive subscriber
 */
var fromIterable = (function (input) {
  return(
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
})

var toList = (function (subscribe) {
  var ret = [];
  subscribe(function (element) {
    ret.push(element);
  });
  return ret;
})

var list = (function () {
  for (var _len = arguments.length, transforms = Array(_len), _key = 0; _key < _len; _key++) {
    transforms[_key] = arguments[_key];
  }

  return function (input) {
    var result = compose.apply(undefined, [fromIterable].concat(transforms))(input);
    if (typeof result === 'function') return toList(result);
    return result;
  };
})

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
})

var toObject = (function (subscribe) {
  var ret = {};
  subscribe(function (element, key) {
    ret[key] = element;
  });
  return ret;
})

var object = (function () {
  for (var _len = arguments.length, transforms = Array(_len), _key = 0; _key < _len; _key++) {
    transforms[_key] = arguments[_key];
  }

  return function (input) {
    var result = compose.apply(undefined, [fromObject].concat(transforms))(input);
    if (typeof result === 'function') return toObject(result);
    return result;
  };
})

var toString = (function (subscribe) {
  var ret = '';
  subscribe(function (char) {
    ret += char;
  });
  return ret;
})

var string = (function () {
  for (var _len = arguments.length, transforms = Array(_len), _key = 0; _key < _len; _key++) {
    transforms[_key] = arguments[_key];
  }

  return function (input) {
    var result = compose.apply(undefined, [fromIterable].concat(transforms))(input);
    if (typeof result === 'function') return toString(result);
    return result;
  };
})

var empty = function empty() {};
var identity = function identity(x) {
  return x;
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

var chunk = (function () {
  var _size = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

  if (!_size || _size < 1) return function () {
    return empty;
  };
  var size = Math.floor(_size);
  return function (subscribe) {
    return function (onNext) {
      var cache = [];
      var count = 0;
      var result = subscribe(function (element) {
        cache.push(element);
        if (cache.length >= size) {
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
    };
  };
})

var filter = (function (f) {
  return function (subscribe) {
    return function (onNext) {
      var count = -1;
      return subscribe(function (element, key) {
        if (f(element, key)) {
          count += 1;
          return onNext(element, count);
        }
        return true;
      });
    };
  };
})

var compact = (function () {
  return filter(function (x) {
    return !!x;
  });
})

var just = (function (input) {
  return function (onNext) {
    return onNext(input, 0);
  };
})

var from = (function (input) {
  if (isArray(input) || isString(input)) return fromIterable(input);
  // else if (isPromise(input)) return fromPromise(input);
  else if (typeof input === 'function') return input; // assume it's sequenz already
  return just(input);
})

var concat = (function () {
  for (var _len = arguments.length, sequenzs = Array(_len), _key = 0; _key < _len; _key++) {
    sequenzs[_key] = arguments[_key];
  }

  return function (subscribe) {
    return function (onNext) {
      var subscriptions = [subscribe].concat(sequenzs.map(function (seq) {
        return typeof seq === 'function' ? seq : from(seq);
      }));
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
})

var findOrigin = (function () {
  var predicate = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
  var fromIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
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
})

var findIndex = (function (predicate, fromIndex) {
  return function (subscribe) {
    return findOrigin(predicate, fromIndex)(subscribe).index;
  };
})

var findLastOrigin = (function () {
  var predicate = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
  var fromIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
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
})

var findLastIndex = (function (predicate, fromIndex) {
  return function (subscribe) {
    return findLastOrigin(predicate, fromIndex)(subscribe).index;
  };
})

var indexOf = (function (value) {
  var fromIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  return fromIndex < 0 ? findLastIndex(function (x) {
    return x === value;
  }, -1 * fromIndex) : findIndex(function (x) {
    return x === value;
  }, fromIndex);
})

var contains = (function (value) {
  var fromIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  return function (subscribe) {
    return indexOf(value, fromIndex)(subscribe) >= 0;
  };
})

var countBy = (function () {
  var iteratee = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
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
})

var map = (function (f) {
  return function (subscribe) {
    return function (onNext) {
      return subscribe(function (element, key) {
        return onNext(f(element, key), key);
      });
    };
  };
})

var differenceOrigin = (function () {
  for (var _len = arguments.length, inputs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    inputs[_key - 2] = arguments[_key];
  }

  var iteratee = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
  var comparator = arguments.length <= 1 || arguments[1] === undefined ? equal : arguments[1];

  var values = void 0;
  if (iteratee === identity) {
    values = inputs.map(function (input) {
      if (isArray(input)) return input;
      return compose(from, toList)(input);
    }).reduce(function (ret, input) {
      return ret.concat(input);
    });
    return filter(function (x) {
      return values.every(function (y) {
        return comparator(x, y) !== 0;
      });
    });
  }
  values = inputs.map(function (input) {
    return compose(from, map(iteratee), toList)(input);
  }).reduce(function (ret, value) {
    return ret.concat(value);
  });
  return filter(function (x) {
    return values.every(function (y) {
      return comparator(iteratee(x), y) !== 0;
    });
  });
})

var differenceWith = (function () {
  var comparator = arguments.length <= 0 || arguments[0] === undefined ? equal : arguments[0];
  return function () {
    for (var _len = arguments.length, inputs = Array(_len), _key = 0; _key < _len; _key++) {
      inputs[_key] = arguments[_key];
    }

    return differenceOrigin.apply(undefined, [undefined, comparator].concat(inputs));
  };
})

var difference = (function () {
  return differenceWith().apply(undefined, arguments);
})

var differenceBy = (function () {
  var iteratee = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
  return function () {
    for (var _len = arguments.length, inputs = Array(_len), _key = 0; _key < _len; _key++) {
      inputs[_key] = arguments[_key];
    }

    return differenceOrigin.apply(undefined, [iteratee, undefined].concat(inputs));
  };
})

var skipWhile = (function (f) {
  return function (subscribe) {
    return function (onNext) {
      var shouldSkip = true;
      var count = -1;
      return subscribe(function (element, key) {
        if (shouldSkip && f(element, key)) return true;
        shouldSkip = false;
        count += 1;
        return onNext(element, count);
      });
    };
  };
})

var skip = (function () {
  var num = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

  if (!num) return identity; // do not drop any element
  var n = Math.floor(num);
  return skipWhile(function (_, i) {
    return i < n;
  });
})

var skipRight = (function () {
  var num = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

  if (num < 1) return identity;
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
})

var skipRightWhile = (function () {
  var predicate = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];

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
})

var each = (function (f) {
  return function (subscribe) {
    return subscribe(f);
  };
})

var every = (function () {
  var predicate = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
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
})

var fill = (function (value, start, end) {
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
})

var find = (function (predicate, fromIndex) {
  return function (subscribe) {
    return findOrigin(predicate, fromIndex)(subscribe).value;
  };
})

var findLast = (function (predicate, fromIndex) {
  return function (subscribe) {
    return findLastOrigin(predicate, fromIndex)(subscribe).value;
  };
})

var firstOrDefault = (function (defaultValue) {
  return function (subscribe) {
    var ret = defaultValue;
    subscribe(function (element) {
      ret = element;return false;
    });
    return ret;
  };
})

var first = (function () {
  return firstOrDefault(undefined);
})

var isMatch = function isMatch(properties) {
  var keys = Object.keys(properties);
  var length = keys.length;
  return function (obj) {
    for (var i = 0; i < length; i += 1) {
      var key = keys[i];
      if (!Object.prototype.hasOwnProperty.call(obj, key) || properties[key] !== obj[key]) {
        return false;
      }
    }
    return true;
  };
};
var where = (function (properties) {
  return filter(isMatch(properties));
})

var findWhere = (function (properties) {
  return compose(where(properties), first());
})

var flattenDepth = (function () {
  var depth = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
  return function (subscribe) {
    return function (onNext) {
      var count = -1;
      var doNext = function doNext(element) {
        count += 1;return onNext(element, count);
      };
      var recursiveSubscribe = function recursiveSubscribe(sub, currentDepth) {
        return sub(function (element) {
          if (isArray(element) && currentDepth < depth) {
            return recursiveSubscribe(fromIterable(element), currentDepth + 1);
          }
          return doNext(element);
        });
      };
      return recursiveSubscribe(subscribe, 0);
    };
  };
})

var flatten = (function () {
  return flattenDepth(1);
})

var flattenDeep = (function () {
  return flattenDepth(Infinity);
})

var fromPairs = (function () {
  return function (subscribe) {
    var result = {};
    subscribe(function (_ref) {
      var _ref2 = babelHelpers.slicedToArray(_ref, 2);

      var key = _ref2[0];
      var value = _ref2[1];
      result[key] = value;
    });
    return result;
  };
})

var functions = (function () {
  return filter(isFunction);
})

var _arguments = arguments;
var reduce = (function (iteratee, initial) {
  if (_arguments.length === 1) {
    return function (subscribe) {
      var result = void 0;
      var hasInitial = false;
      subscribe(function (element) {
        if (!hasInitial) {
          hasInitial = true;
          result = element;
        } else {
          result = iteratee(result, element);
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
})

var groupBy = (function (iteratee) {
  var mapFn = isString(iteratee) ? function (element) {
    return element[iteratee];
  } : iteratee;
  return function (subscribe) {
    return reduce(function (previous, element) {
      var key = mapFn(element);
      if (Object.prototype.hasOwnProperty.call(previous, key)) {
        previous[key].push(element);
      } else {
        previous[key] = [element]; // eslint-disable-line no-param-reassign
      }
      return previous;
    }, {})(subscribe);
  };
})

var indexBy = (function (iteratee) {
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
})

var initial = (function () {
  return skipRight(1);
})

var intersectionOrigin = (function () {
  for (var _len = arguments.length, inputs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    inputs[_key - 2] = arguments[_key];
  }

  var iteratee = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
  var comparator = arguments.length <= 1 || arguments[1] === undefined ? equal : arguments[1];

  var values = void 0;
  if (iteratee === identity) {
    values = inputs.map(function (input) {
      if (isArray(input)) return input;
      return compose(from, toList)(input);
    }).reduce(function (ret, input) {
      return ret.concat(input);
    });
    return filter(function (x) {
      return values.some(function (y) {
        return comparator(x, y);
      });
    });
  }
  values = inputs.map(function (input) {
    return compose(from, map(iteratee), toList)(input);
  }).reduce(function (ret, value) {
    return ret.concat(value);
  });
  return filter(function (x) {
    return values.some(function (y) {
      return comparator(iteratee(x), y);
    });
  });
})

var intersectionWith = (function () {
  var comparator = arguments.length <= 0 || arguments[0] === undefined ? equal : arguments[0];
  return function () {
    for (var _len = arguments.length, inputs = Array(_len), _key = 0; _key < _len; _key++) {
      inputs[_key] = arguments[_key];
    }

    return intersectionOrigin.apply(undefined, [undefined, comparator].concat(inputs));
  };
})

var intersection = (function () {
  for (var _len = arguments.length, input = Array(_len), _key = 0; _key < _len; _key++) {
    input[_key] = arguments[_key];
  }

  return intersectionWith.apply(undefined, [undefined].concat(input));
})

var intersectionBy = (function () {
  var iteratee = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
  return function () {
    for (var _len = arguments.length, inputs = Array(_len), _key = 0; _key < _len; _key++) {
      inputs[_key] = arguments[_key];
    }

    return intersectionOrigin.apply(undefined, [iteratee, undefined].concat(inputs));
  };
})

var invert = (function () {
  return function (subscribe) {
    return function (onNext) {
      return subscribe(function (element, key) {
        return onNext(key, element);
      });
    };
  };
})

var join = (function () {
  var separator = arguments.length <= 0 || arguments[0] === undefined ? ',' : arguments[0];
  return function (subscribe) {
    return toList(subscribe).join(separator);
  };
})

var keys = (function () {
  return function (subscribe) {
    return function (onNext) {
      var count = -1;
      return subscribe(function (_, key) {
        count += 1;
        onNext(key, count);
      });
    };
  };
})

var lastOrDefault = (function (defaultValue) {
  return function (subscribe) {
    var value = defaultValue;
    subscribe(function (element) {
      value = element;
    });
    return value;
  };
})

var last = (function () {
  return lastOrDefault(undefined);
})

var lastIndexOf = (function (value) {
  var fromIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  return findLastIndex(function (element) {
    return element === value;
  }, fromIndex);
})

var max = (function () {
  var iteratee = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
  return function (subscribe) {
    return reduce(function (max, num) {
      var rank = iteratee(num);
      if (!isNumber(rank)) return max;
      if (max.rank < rank) {
        return { rank: rank, value: num };
      }
      return max;
    }, { rank: -Infinity, value: -Infinity })(subscribe).value;
  };
})

var min = (function () {
  var iteratee = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
  return function (subscribe) {
    return reduce(function (min, num) {
      var rank = iteratee(num);
      if (!isNumber(rank)) return min;
      if (min.rank > rank) {
        return { rank: rank, value: num };
      }
      return min;
    }, { rank: Infinity, value: Infinity })(subscribe).value;
  };
})

var takeRight = (function () {
  var num = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
  return function (subscribe) {
    return function (onNext) {
      var length = num || 0;
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
})

var nth = (function () {
  var n = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

  if (n >= 0) return compose(skip(n - 1), first());
  return compose(takeRight(n * -1), first());
})

var pairs = (function () {
  return function (subscribe) {
    return function (onNext) {
      var count = -1;
      return subscribe(function (element, key) {
        count += 1;
        return onNext([key, element], count);
      });
    };
  };
})

var partition = (function (predicate) {
  return function (subscribe) {
    return reduce(function (result, element, key) {
      if (predicate(element, key)) result[0].push(element);else result[1].push(element);
      return result;
    }, [[], []])(subscribe);
  };
})

var pickBy = (function (f) {
  return function (subscribe) {
    return function (onNext) {
      return subscribe(function (element, key) {
        if (f(element, key)) return onNext(element, key);
        return true;
      });
    };
  };
})

var pluck = (function (propertyName) {
  return map(function (element) {
    return element[propertyName];
  });
})

var _arguments$1 = arguments;
var range = (function () {
  var start = 0;
  var stop = void 0;
  var step = 1;
  if (_arguments$1.length === 1) stop = _arguments$1[0];else if (_arguments$1.length === 2) {
    start = _arguments$1[0];
    stop = _arguments$1[1];
  } else {
    start = _arguments$1[0];
    stop = _arguments$1[1];
    step = _arguments$1[2];
  }
  return function (onNext) {
    for (var i = start, count = 0; i < stop; i += step, count += 1) {
      if (onNext(i, count) === false) return false;
    }
    return true;
  };
})

var remove = (function () {
  var f = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
  return filter(not(f, 2));
})

var repeat = (function (element, times) {
  return function (onNext) {
    for (var i = 0; i < times; i += 1) {
      if (onNext(element, i) === false) return false;
    }return true;
  };
})

var reverse = (function () {
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
})

var scan = (function (iteratee, initial) {
  return function (subscribe) {
    return function (onNext) {
      var previous = initial;
      return subscribe(function (element, key) {
        previous = iteratee(previous, element);
        return onNext(previous, key);
      });
    };
  };
})

var size = (function () {
  return function (subscribe) {
    return reduce(function (count) {
      return count + 1;
    }, 0)(subscribe);
  };
})

var takeWhile = (function () {
  var predicate = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
  return function (subscribe) {
    return function (onNext) {
      return subscribe(function (element, key) {
        if (predicate(element, key)) return onNext(element, key);
        return false;
      });
    };
  };
})

var take = (function () {
  var num = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
  return takeWhile(function (_, idx) {
    return idx < num;
  });
})

var slice = (function () {
  var start = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
  var end = arguments.length <= 1 || arguments[1] === undefined ? Infinity : arguments[1];
  return compose(skip(start), take(end - start));
})

var some = (function (predicate) {
  return function (subscribe) {
    var result = false;
    subscribe(function (element) {
      if (predicate(element)) result = true;
      return !result;
    });
    return result;
  };
})

var sortedUniqBy = (function (iteratee) {
  return function (subscribe) {
    return function (onNext) {
      var previous = void 0;
      var count = -1;
      return subscribe(function (element) {
        var item = iteratee(element);
        if (count >= 0 && previous === item) return true;
        count += 1;
        previous = item;
        return onNext(element, count);
      });
    };
  };
})

var sortedUniq = (function () {
  return sortedUniqBy(identity);
})

var tail = (function () {
  return skip(1);
})

var takeRightWhile = (function () {
  var predicate = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
  return function (subscribe) {
    return function (onNext) {
      var cache = [];
      subscribe(function (element, i) {
        if (predicate(element, i)) cache.push(element);else if (cache.length !== 0) cache = [];
        return true;
      });
      for (var i = 0; i < cache.length; i += 1) {
        if (onNext(cache[i], i) === false) return false;
      }
      return true;
    };
  };
})

var tap = (function (f) {
  return function (subscribe) {
    return function (onNext) {
      return subscribe(function (element, key) {
        f(element, key);
        return onNext(element, key);
      });
    };
  };
})

var uniqOrigin = (function () {
  var iteratee = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
  var comparator = arguments.length <= 1 || arguments[1] === undefined ? equal : arguments[1];
  return function (subscribe) {
    var cache = [];
    return function (onNext) {
      return subscribe(function (element) {
        if (cache.some(function (value) {
          return comparator(iteratee(value), iteratee(element));
        })) return true;
        cache.push(element);
        return onNext(element, cache.length - 1);
      });
    };
  };
})

var unionOrigin = (function () {
  for (var _len = arguments.length, inputs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    inputs[_key - 2] = arguments[_key];
  }

  var iteratee = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
  var comparator = arguments.length <= 1 || arguments[1] === undefined ? equal : arguments[1];

  var values = inputs.map(function (input) {
    if (isArray(input)) return input;
    return compose(from, toList)(input);
  }).reduce(function (prev, curr) {
    return prev.concat(curr);
  });
  return compose(concat(values), uniqOrigin(iteratee, comparator));
})

var union = (function () {
  for (var _len = arguments.length, inputs = Array(_len), _key = 0; _key < _len; _key++) {
    inputs[_key] = arguments[_key];
  }

  return unionOrigin.apply(undefined, [undefined, undefined].concat(inputs));
})

var unionBy = (function (iteratee) {
  return function () {
    for (var _len = arguments.length, inputs = Array(_len), _key = 0; _key < _len; _key++) {
      inputs[_key] = arguments[_key];
    }

    return unionOrigin.apply(undefined, [iteratee, undefined].concat(inputs));
  };
})

var unionWith = (function (comparator) {
  return function () {
    for (var _len = arguments.length, inputs = Array(_len), _key = 0; _key < _len; _key++) {
      inputs[_key] = arguments[_key];
    }

    return unionOrigin.apply(undefined, [undefined, comparator].concat(inputs));
  };
})

var uniq = (function () {
  return uniqOrigin();
})

var uniqBy = (function (iteratee) {
  return uniqOrigin(iteratee);
})

var uniqWith = (function (comparator) {
  return uniqOrigin(undefined, comparator);
})

var unzipWith = (function (iteratee) {
  return function (subscribe) {
    return function (onNext) {
      var cache = void 0;
      subscribe(function (element) {
        if (!isArray(element)) throw new Error('Element is not an array!');
        if (!cache) cache = new Array(element.length);
        for (var i = 0; i < element.length; i += 1) {
          if (!cache[i]) cache[i] = [iteratee(element[i])];else cache[i].push(iteratee(element[i]));
        }
      });
      return fromIterable(cache)(onNext);
    };
  };
})

var unzip = (function () {
  return unzipWith(identity);
})

var without = (function () {
  for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  return difference(values);
})

var zipWith = (function () {
  for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  var iteratee = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
  return function (subscribe) {
    return function (onNext) {
      var inputs = [undefined].concat(values);
      return subscribe(function (element, i) {
        return onNext(iteratee.apply(null, inputs.map(function (list, index) {
          return index ? list[i] : element;
        })), i);
      });
    };
  };
})

var zip = (function () {
  for (var _len = arguments.length, input = Array(_len), _key = 0; _key < _len; _key++) {
    input[_key] = arguments[_key];
  }

  return zipWith.apply(undefined, [undefined].concat(input));
})

var zipObjectWith = (function () {
  for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  var iteratee = arguments.length <= 0 || arguments[0] === undefined ? identity : arguments[0];
  return function (subscribe) {
    return function (onNext) {
      return subscribe(function (key, i) {
        return onNext(iteratee.apply(null, values.map(function (list) {
          return list[i];
        })), key);
      });
    };
  };
})

var zipObject = (function () {
  for (var _len = arguments.length, input = Array(_len), _key = 0; _key < _len; _key++) {
    input[_key] = arguments[_key];
  }

  return zipObjectWith.apply(undefined, [undefined].concat(input));
})

exports.list = list;
exports.object = object;
exports.string = string;
exports.fromIterable = fromIterable;
exports.chunk = chunk;
exports.compact = compact;
exports.concat = concat;
exports.contains = contains;
exports.countBy = countBy;
exports.difference = difference;
exports.differenceBy = differenceBy;
exports.differenceWith = differenceWith;
exports.drop = skip;
exports.dropRight = skipRight;
exports.dropRightWhile = skipRightWhile;
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
exports.intersection = intersection;
exports.intersectionBy = intersectionBy;
exports.intersectionWith = intersectionWith;
exports.invert = invert;
exports.join = join;
exports.keys = keys;
exports.last = last;
exports.lastIndexOf = lastIndexOf;
exports.lastOrDefault = lastOrDefault;
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
exports.reject = remove;
exports.remove = remove;
exports.repeat = repeat;
exports.reverse = reverse;
exports.scan = scan;
exports.size = size;
exports.slice = slice;
exports.skip = skip;
exports.skipRight = skipRight;
exports.skipRightWhile = skipRightWhile;
exports.skipWhile = skipWhile;
exports.some = some;
exports.sortedUniq = sortedUniq;
exports.sortedUniqBy = sortedUniqBy;
exports.tail = tail;
exports.take = take;
exports.takeRight = takeRight;
exports.takeRightWhile = takeRightWhile;
exports.takeWhile = takeWhile;
exports.tap = tap;
exports.union = union;
exports.unionBy = unionBy;
exports.unionWith = unionWith;
exports.uniq = uniq;
exports.uniqBy = uniqBy;
exports.uniqWith = uniqWith;
exports.unzip = unzip;
exports.unzipWith = unzipWith;
exports.where = where;
exports.without = without;
exports.zip = zip;
exports.zipObject = zipObject;
exports.zipObjectWith = zipObjectWith;
exports.zipWith = zipWith;