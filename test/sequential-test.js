import * as sequenz from '../src/index';
import { falsey, isNotUndefined, isEven } from './utils';

describe('chunk:', () => {
  const input = [0, 1, 2, 3, 4, 5];
  it('should return chunked arrays', () => {
    const actual = sequenz.list(sequenz.chunk(3))(input);
    expect(actual).toEqual([[0, 1, 2], [3, 4, 5]]);
  });
  it('should return the last chunk as remaining elements', () => {
    const actual = sequenz.list(sequenz.chunk(4))(input);
    expect(actual).toEqual([[0, 1, 2, 3], [4, 5]]);
  });
  it('should treat falsey `size` values, except `undefined`, as `0`', () => {
    const expected = falsey.map(value =>
      (value === undefined ? [[0], [1], [2], [3], [4], [5]] : []));
    const actual = falsey.map((value, index) =>
      (index ? sequenz.list(sequenz.chunk(value)) : sequenz.list(sequenz.chunk())))
      .map(seq => seq(input));
    falsey.forEach((value, idx) => {
      expect(actual[idx]).toEqual(expected[idx], `falsey value: ${value}`);
    });
  });
  it('should ensure the minimum `size` is `0`', () => {
    const values = falsey.filter(isNotUndefined).concat([-1, -Infinity]);
    values.forEach((value, idx) => {
      const actual = sequenz.list(sequenz.chunk(value))(input);
      expect(actual).toEqual([], `input: ${values[idx]}`);
    });
  });
  it('should coerce `size` to an integer', () => {
    const actual = sequenz.list(sequenz.chunk(input.length / 4))(input);
    expect(actual).toEqual([[0], [1], [2], [3], [4], [5]]);
  });
  it('should be able to terminate when necessary', () => {
    const actual = sequenz.list(sequenz.chunk(2), sequenz.take(2))(input);
    expect(actual).toEqual([[0, 1], [2, 3]]);
  });
});

describe('compact:', () => {
  it('should filter falsey values', () => {
    const input = [1, 2, 3].concat(falsey);
    const actual = sequenz.list(sequenz.compact())(input);
    expect(actual).toEqual([1, 2, 3]);
  });
});

describe('concat:', () => {
  it('should shallow clone `array`', () => {
    const array = [1, 2, 3];
    const actual = sequenz.list(sequenz.concat())(array);
    expect(actual).toEqual(array);
    expect(actual).not.toBe(array);
  });
  it('should concat arrays and values', () => {
    const array = [1];
    const actual = sequenz.list(sequenz.concat(2, [3], [[4]]))(array);
    expect(actual).toEqual([1, 2, 3, [4]]);
    expect(array).toEqual([1]);
  });
  it('should treat sparse arrays as dense', () => {
    const expected = [undefined, undefined];
    const actual = sequenz.list(sequenz.concat(Array(1)))(Array(1));
    expect('0' in actual).toBe(true);
    expect('1' in actual).toBe(true);
    expect(actual).toEqual(expected);
  });
  it('should report termination correctly', () => {
    const actual = sequenz.list(
      sequenz.concat([4, 5, 6]),
      sequenz.take(4)
    )([1, 2, 3]);
    expect(actual).toEqual([1, 2, 3, 4]);
  });
  it('should concat sequenz as well', () => {
    const actual = sequenz.list(
      sequenz.concat(sequenz.fromIterable([4, 5, 6]))
    )([1, 2, 3]);
    expect(actual).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe('contains:', () => {
  const input = [1, 2, 3];
  it('should work with and an array and a positive `fromIndex`', () => {
    const actual = sequenz.list(sequenz.contains(3, 1))(input);
    expect(actual).toBe(true);
  });
  it('should work with an array and a `fromIndex` larger than `length`', () => {
    const actual = sequenz.list(sequenz.contains(2, 3))(input);
    expect(actual).toBe(false);
  });
  it('should work with an array and treat falsy `fromIndex` value as `0`', () => {
    falsey.forEach((value) => {
      const actual = sequenz.list(sequenz.contains(1, value))(input);
      expect(actual).toBe(true);
    });
  });
  it('should work with an array and a negative `fromIndex`', () => {
    const actual = sequenz.list(sequenz.contains(3, -2))(input);
    expect(actual).toBe(true);
    const notFound = sequenz.list(sequenz.contains(1, -2))(input);
    expect(notFound).toBe(false);
  });
  it('should work with an array and a negative `fromIndex` smaller than -1 * `length`', () => {
    const actual = sequenz.list(sequenz.contains(1, -3))(input);
    expect(actual).toBe(false);
  });
});

describe('countBy:', () => {
  it('should transform keys by `iteratee`', () => {
    const input = [1.1, 2.2, 1.3];
    const actual = sequenz.list(sequenz.countBy(Math.floor))(input);
    expect(actual).toEqual({ 1: 2, 2: 1 });
  });
  it('should use identity function when `iteratee` is not given', () => {
    const input = [1.1, 2.2, 1.3];
    const actual = sequenz.list(sequenz.countBy())(input);
    expect(actual).toEqual({ 1.1: 1, 2.2: 1, 1.3: 1 });
  });
  it('should work when `iteratee` is string, use this to read property from each element', () => {
    const input = ['one', 'two', 'three'];
    const actual = sequenz.list(sequenz.countBy('length'))(input);
    expect(actual).toEqual({ 3: 2, 5: 1 });
  });
  it('should work when `iteratee` is a number (as a property name after convert to string)', () => {
    const input = [[1, 'a'], [2, 'b'], [2, 'B']];
    const actual = sequenz.list(sequenz.countBy(0))(input);
    expect(actual).toEqual({ 1: 1, 2: 2 });
  });
});

describe('difference:', () => {
  it('should only return elements not in given array ', () => {
    const input = [2, 1];
    const actual = sequenz.list(sequenz.difference([2, 3]))(input);
    expect(actual).toEqual([1]);
  });
  it('should work with multiple arrays as well', () => {
    const input = [2, 1];
    const actual = sequenz.list(sequenz.difference([2, 3], [3, 4]))(input);
    expect(actual).toEqual([1]);
  });
  it('should work with sequenz as well', () => {
    const input = [2, 1];
    const actual = sequenz.list(sequenz.difference(sequenz.fromIterable([2, 3])))(input);
    expect(actual).toEqual([1]);
  });
});

describe('differenceBy:', () => {
  it('should use `identity` if `iteratee` is not provided', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.differenceBy()([2, 3]))(input);
    expect(actual).toEqual([1]);
  });
  it('should accept an `iteratee`', () => {
    const input = [2.1, 1.2];
    const actual = sequenz.list(sequenz.differenceBy(Math.floor)([2.3, 3.4]))(input);
    expect(actual).toEqual([1.2]);
  });
  it('should work with multiple arrays as well', () => {
    const input = [2.1, 1.2];
    const actual = sequenz.list(sequenz.differenceBy(Math.floor)([2.3, 3.4], [3.5, 4.6]))(input);
    expect(actual).toEqual([1.2]);
  });
  it('should work with sequenz as well', () => {
    const input = [2.1, 1.2];
    const actual = sequenz.list(
      sequenz.differenceBy(Math.floor)(sequenz.fromIterable([2.3, 3.4]))
    )(input);
    expect(actual).toEqual([1.2]);
  });
});

describe('differenceWith:', () => {
  const comparator = (x, y) => Math.abs(x.x - y.x) + Math.abs(x.y - y.y);
  it('should work with a `comparator`', () => {
    const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }];
    const actual = sequenz.list(
      sequenz.differenceWith(comparator)([{ x: 1, y: 2 }])
    )(objects);
    expect(actual).toEqual([objects[1]]);
  });
  it('should work with multiple arrays as well', () => {
    const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }];
    const actual = sequenz.list(
      sequenz.differenceWith(comparator)([{ x: 1, y: 2 }], [{ x: 1, y: 3 }])
    )(objects);
    expect(actual).toEqual([objects[1]]);
  });
  it('should work with sequenz as well', () => {
    const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }];
    const actual = sequenz.list(
      sequenz.differenceWith(comparator)(sequenz.fromIterable([{ x: 1, y: 2 }]))
    )(objects);
    expect(actual).toEqual([objects[1]]);
  });
});

describe('each:', () => {
  it('should works through each element', () => {
    const input = [1, 2, 3];
    const callback = jasmine.createSpy('callback');
    sequenz.list(sequenz.each(callback))(input);
    expect(callback.calls.allArgs()).toEqual([
      [1, 0],
      [2, 1],
      [3, 2],
    ]);
  });
  it('should have alias `forEach`', () => {
    expect(sequenz.each).toBe(sequenz.forEach);
  });
});

describe('every:', () => {
  it('should return `true` if `predicate` returns truthy for all elements', () => {
    const input = [true, 1, 'a'];
    const actual = sequenz.list(sequenz.every(x => x))(input);
    expect(actual).toBe(true);
  });
  it('should return `true` for empty collections', () => {
    const input = [];
    const actual = sequenz.list(sequenz.every(() => true))(input);
    expect(actual).toBe(true);
  });
  it('should return `false` as soon as `predicate` returns falsey', () => {
    const input = [1, 2, 3, 4, 5];
    const callback = jasmine.createSpy('callback').and.returnValue(false);
    const actual = sequenz.list(sequenz.every(callback))(input);
    expect(actual).toBe(false);
    expect(callback).toHaveBeenCalledTimes(1);
  });
  it('should work with collections of `undefined` values (test in IE < 9)', () => {
    const actual = sequenz.list(sequenz.every(x => x))([undefined, undefined, undefined]);
    expect(actual).toBe(false);
  });
  it('should use `identity` when `predicate` is undefined', () => {
    const input = [0];
    expect(sequenz.list(sequenz.every())(input)).toBe(false);
    expect(sequenz.list(sequenz.every(undefined))(input)).toBe(false);
  });
});

describe('fill:', () => {
  const input = [1, 2, 3];
  it('should use a default `start` of `0` and a default `end` of `length`', () => {
    const actual = sequenz.list(sequenz.fill('a'))(input);
    expect(actual).toEqual(['a', 'a', 'a']);
  });
  it('should use `undefined` for `value` if not give', () => {
    const actual = sequenz.list(sequenz.fill())(input);
    expect(actual).toEqual([undefined, undefined, undefined]);
  });
  it('should work with a positive `start`', () => {
    const actual = sequenz.list(sequenz.fill('a', 1))(input);
    expect(actual).toEqual([1, 'a', 'a']);
  });
  it('should work with a `start` >= `length`', () => {
    [3, 4, 100].forEach(start => {
      const actual = sequenz.list(sequenz.fill('a', start))(input);
      expect(actual).toEqual(input);
    });
  });
  it('should treat falsey `start` values as `0`', () => {
    falsey.forEach((value) => {
      const actual = sequenz.list(sequenz.fill('a', value))(input);
      expect(actual).toEqual(['a', 'a', 'a']);
    });
  });
  it('should work when `start` >= `end`', () => {
    [2, 3].forEach((start) => {
      const actual = sequenz.list(sequenz.fill('a', start, 2))(input);
      expect(actual).toEqual(input);
    });
  });
  it('should work with a `end` >= `length`', () => {
    [3, 4, 100, Infinity].forEach((value) => {
      const actual = sequenz.list(sequenz.fill('a', 0, value))(input);
      expect(actual).toEqual(['a', 'a', 'a']);
    });
  });
  it('should treat falsey `end` values, except `undefined`, as `0`', () => {
    falsey.forEach((value) => {
      const actual = sequenz.list(sequenz.fill('a', undefined, value))(input);
      if (value === undefined) expect(actual).toEqual(['a', 'a', 'a']);
      else expect(actual).toEqual(input);
    });
  });
  it('should coerce `start` and `end` to integers', () => {
    const positions = [[0.1, 1.6], ['0', 1], [0, '1'], ['1'], [NaN, 1], [1, NaN]];
    const actual = positions.map((position) =>
      sequenz.list(sequenz.fill('a', position[0], position[1]))(input)
    );
    expect(actual).toEqual([
      ['a', 2, 3],
      ['a', 2, 3],
      ['a', 2, 3],
      [1, 'a', 'a'],
      ['a', 2, 3],
      [1, 2, 3],
    ]);
  });
});

describe('find:', () => {
  const input = ['one', 'two', 'three'];
  it('should return element if found', () => {
    const actual = sequenz.list(sequenz.find(x => x.length === 3))(input);
    expect(actual).toBe('one');
  });
  it('should return `undefined` if not found', () => {
    const actual = sequenz.list(sequenz.find(x => x.length === 4))(input);
    expect(actual).toBeUndefined();
  });
  it('should use `identity` if `predicate` not provided', () => {
    const actual = sequenz.list(sequenz.find())([false, null, '1', true]);
    expect(actual).toBe('1');
  });
  it('should work with a positive `fromIndex`', () => {
    const actual = sequenz.list(sequenz.find(x => x.length === 3, 1))(input);
    expect(actual).toBe('two');
  });
  it('should work with `fromIndex` >= `length`', () => {
    [3, 4, 100, Infinity].forEach((fromIndex) => {
      const actual = sequenz.list(sequenz.find(x => x.length === 3, fromIndex))(input);
      expect(actual).toBeUndefined();
    });
  });
  it('should treat falsey `fromIndex` value as 0', () => {
    falsey.forEach((fromIndex) => {
      const actual = sequenz.list(sequenz.find(x => x.length === 3, fromIndex))(input);
      expect(actual).toBe('one');
    });
  });
  it('should coerce `fromIndex` to an integer', () => {
    const actual = sequenz.list(sequenz.find(x => x.length === 3, 1.6))(input);
    expect(actual).toBe('two');
  });
});

describe('findIndex:', () => {
  const input = ['one', 'two', 'three'];
  it('should return index of element if found', () => {
    const actual = sequenz.list(sequenz.findIndex(x => x.length === 3))(input);
    expect(actual).toBe(0);
  });
  it('should return `-1` if not found', () => {
    const actual = sequenz.list(sequenz.findIndex(x => x.length === 4))(input);
    expect(actual).toBe(-1);
  });
  it('should use `identity` if `predicate` not provided', () => {
    const actual = sequenz.list(sequenz.findIndex())([false, null, '1', true]);
    expect(actual).toBe(2);
  });
  it('should work with a positive `fromIndex`', () => {
    const actual = sequenz.list(sequenz.findIndex(x => x.length === 3, 1))(input);
    expect(actual).toBe(1);
  });
  it('should work with `fromIndex` >= `length`', () => {
    [3, 4, 100, Infinity].forEach((fromIndex) => {
      const actual = sequenz.list(sequenz.findIndex(x => x.length === 3, fromIndex))(input);
      expect(actual).toBe(-1);
    });
  });
  it('should treat falsey `fromIndex` value as 0', () => {
    falsey.forEach((fromIndex) => {
      const actual = sequenz.list(sequenz.findIndex(x => x.length === 3, fromIndex))(input);
      expect(actual).toBe(0);
    });
  });
  it('should coerce `fromIndex` to an integer', () => {
    const actual = sequenz.list(sequenz.findIndex(x => x.length === 3, 1.6))(input);
    expect(actual).toBe(1);
  });
});

describe('findLast:', () => {
  const input = ['one', 'two', 'three'];
  it('should return element if found', () => {
    const actual = sequenz.list(sequenz.findLast(x => x.length === 3))(input);
    expect(actual).toBe('two');
  });
  it('should return `undefined` if not found', () => {
    const actual = sequenz.list(sequenz.findLast(x => x.length === 4))(input);
    expect(actual).toBeUndefined();
  });
  it('should use `identity` if `predicate` not provided', () => {
    const actual = sequenz.list(sequenz.findLast())([false, null, '1', true]);
    expect(actual).toBe(true);
  });
  it('should work with a positive `fromIndex`', () => {
    const actual = sequenz.list(sequenz.findLast(x => x.length === 3, 1))(input);
    expect(actual).toBe('two');
  });
  it('should work with `fromIndex` >= `length`', () => {
    [3, 4, 100, Infinity].forEach((fromIndex) => {
      const actual = sequenz.list(sequenz.findLast(x => x.length === 3, fromIndex))(input);
      expect(actual).toBeUndefined();
    });
  });
  it('should treat falsey `fromIndex` value as 0', () => {
    falsey.forEach((fromIndex) => {
      const actual = sequenz.list(sequenz.findLast(x => x.length === 3, fromIndex))(input);
      expect(actual).toBe('two');
    });
  });
  it('should coerce `fromIndex` to an integer', () => {
    const actual = sequenz.list(sequenz.find(x => x.length === 3, 1.6))(input);
    expect(actual).toBe('two');
  });
});

describe('findLastIndex:', () => {
  const input = ['one', 'two', 'three'];
  it('should return index of element if found', () => {
    const actual = sequenz.list(sequenz.findLastIndex(x => x.length === 3))(input);
    expect(actual).toBe(1);
  });
  it('should return `-1` if not found', () => {
    const actual = sequenz.list(sequenz.findLastIndex(x => x.length === 4))(input);
    expect(actual).toBe(-1);
  });
  it('should use `identity` if `predicate` not provided', () => {
    const actual = sequenz.list(sequenz.findLastIndex())([false, null, '1', true]);
    expect(actual).toBe(3);
  });
  it('should work with a positive `fromIndex`', () => {
    const actual = sequenz.list(sequenz.findLastIndex(x => x.length === 3, 1))(input);
    expect(actual).toBe(1);
  });
  it('should work with `fromIndex` >= `length`', () => {
    [3, 4, 100, Infinity].forEach((fromIndex) => {
      const actual = sequenz.list(sequenz.findLastIndex(x => x.length === 3, fromIndex))(input);
      expect(actual).toBe(-1);
    });
  });
  it('should treat falsey `fromIndex` value as 0', () => {
    falsey.forEach((fromIndex) => {
      const actual = sequenz.list(sequenz.findLastIndex(x => x.length === 3, fromIndex))(input);
      expect(actual).toBe(1);
    });
  });
  it('should coerce `fromIndex` to an integer', () => {
    const actual = sequenz.list(sequenz.findLastIndex(x => x.length === 3, 1.6))(input);
    expect(actual).toBe(1);
  });
});

describe('filter:', () => {
  it('should return elements where `predicate` returns truthy for', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.filter(isEven))(input);
    expect(actual).toEqual([2]);
  });
  it('should call `predicate` with both element and key/index', () => {
    const input = [1];
    const predicate = jasmine.createSpy('predicate');
    sequenz.list(sequenz.filter(predicate))(input);
    expect(predicate).toHaveBeenCalledWith(1 /* value */, 0 /* index */);

    const object = { a: 1 };
    sequenz.object(sequenz.filter(predicate))(object);
    expect(predicate).toHaveBeenCalledWith(1 /* value */, 'a' /* key */);
  });
});

describe('skip:', () => {
  const input = [1, 2, 3];
  it('should skip the first two elements', () => {
    const actual = sequenz.list(sequenz.skip(2))(input);
    expect(actual).toEqual([3]);
  });
  it('should treat falsey value, except `undefined`, as 0', () => {
    falsey.forEach((value) => {
      const actual = sequenz.list(sequenz.skip(value))(input);
      if (value === undefined) expect(actual).toEqual([2, 3], '`undefined` will be treated as 1');
      else expect(actual).toEqual(input, `${value} will be treated as 0`);
    });
  });
  it('should return all values if number is smaller than 1', () => {
    [-1, 0, -Infinity].forEach((value) => {
      const actual = sequenz.list(sequenz.skip(value))(input);
      expect(actual).toEqual(input, `${value} should result in all values returned`);
    });
  });
  it('should coerce `n` to an integer', () => {
    const actual = sequenz.list(sequenz.skip(1.6))(input);
    expect(actual).toEqual([2, 3]);
  });
  it('should have an alias `drop`', () => {
    expect(sequenz.drop).toBe(sequenz.skip);
  });
});

describe('skipRight:', () => {
  const input = [1, 2, 3, 4, 5];
  it('should skip give number of elements at the end', () => {
    const actual = sequenz.list(sequenz.skipRight(2))(input);
    expect(actual).toEqual(input.slice(0, 3));
  });
  it('should return all values when number is smaller than 1', () => {
    [0, -1, -Infinity].forEach((value) => {
      const actual = sequenz.list(sequenz.skipRight(value))(input);
      expect(actual).toEqual(input, `${value} as param`);
    });
  });
  it('should return empty array when number is greater than `length`', () => {
    const actual = sequenz.list(sequenz.skipRight(input.length))(input);
    expect(actual).toEqual([]);
  });
  it('should coerce `n` to an integer', () => {
    const actual = sequenz.list(sequenz.skipRight(1.6))(input);
    expect(actual).toEqual(input.slice(0, 4));
  });
  it('should have an alias `dropRight`', () => {
    expect(sequenz.dropRight).toBe(sequenz.skipRight);
  });
});

describe('skipWhile:', () => {
  const list = [1, 2, 3, 4];
  it('should drop elements while `predicate` returns truthy', () => {
    const actual = sequenz.list(sequenz.skipWhile(n => n <= 2))(list);
    expect(actual).toEqual([3, 4]);
  });
  it('should provide correct `predicate` arguments', () => {
    const callback = jasmine.createSpy('callback').and.returnValues(true, false);
    sequenz.list(sequenz.skipWhile(callback))(list);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback.calls.allArgs()).toEqual([[1, 0], [2, 1]]);
  });
});

describe('skipRightWhile:', () => {
  it('should skip element in tail if not satisfied `predicate`', () => {
    const input = [1, 2, 3, 4];
    const actual = sequenz.list(sequenz.skipRightWhile(x => x % 3 < 2))(input);
    expect(actual).toEqual([1, 2]);
  });
  it('should provide correct `predicate` arguments', () => {
    const input = [1, 2, 3, 4];
    const callback = jasmine.createSpy('callback').and.returnValues(true, false, true, false);
    sequenz.list(sequenz.skipRightWhile(callback))(input);
    expect(callback).toHaveBeenCalledTimes(4);
    expect(callback.calls.allArgs()).toEqual(input.map((value, i) => [value, i]));
  });
});

describe('take:', () => {
  const input = [1, 2, 3];
  it('should take first two elements', () => {
    const actual = sequenz.list(sequenz.take(2))(input);
    expect(actual).toEqual(input.slice(0, 2));
  });
  it('should treat falsey `n` values, except `undefined`, as `0`', () => {
    falsey.forEach((value) => {
      const actual = sequenz.list(sequenz.take(value))(input);
      expect(actual).toEqual(value === undefined ? [1] : []);
    });
  });
  it('should return empty array when `n` < `1`', () => {
    [0, -1, -Infinity].forEach((value) => {
      const actual = sequenz.list(sequenz.take(value))(input);
      expect(actual).toEqual([]);
    });
  });
  it('should return all values when `n` >= `length`', () => {
    [3, 4, Infinity].forEach((value) => {
      const actual = sequenz.list(sequenz.take((value)))(input);
      expect(actual).toEqual(input);
    });
  });
});

describe('takeRight:', () => {
  const input = [1, 2, 3];
  it('should take last two elements', () => {
    const actual = sequenz.list(sequenz.takeRight(2))(input);
    expect(actual).toEqual(input.slice(1, 3));
  });
  it('should treat falsey `n` values, except `undefined`, as `0`', () => {
    falsey.forEach((value) => {
      const actual = sequenz.list(sequenz.takeRight(value))(input);
      expect(actual).toEqual(value === undefined ? [3] : []);
    });
  });
  it('should return empty array when `n` < `1`', () => {
    [0, -1, -Infinity].forEach((value) => {
      const actual = sequenz.list(sequenz.takeRight(value))(input);
      expect(actual).toEqual([]);
    });
  });
  it('should return all values when `n` >= `length`', () => {
    [3, 4, Infinity].forEach((value) => {
      const actual = sequenz.list(sequenz.takeRight((value)))(input);
      expect(actual).toEqual(input);
    });
  });
});

describe('takeWhile:', () => {
  const input = [1, 2, 3];
  it('should take elements while `predicate` returns truthy', () => {
    const actual = sequenz.list(sequenz.takeWhile(n => n % 2 === 1))(input);
    expect(actual).toEqual([1]);
  });
  it('should provide correct arguments to `predicate`', () => {
    const callback = jasmine.createSpy('callback').and.returnValues(true, false);
    sequenz.list(sequenz.takeWhile(callback))(input);
    expect(callback.calls.allArgs()).toEqual([[1, 0], [2, 1]]);
  });
});

describe('takeRightWhile:', () => {
  const input = [1, 2, 3];
  it('should take elements while `predicate` returns truthy', () => {
    const actual = sequenz.list(sequenz.takeRightWhile(n => n % 2 === 1))(input);
    expect(actual).toEqual([3]);
  });
  it('should provide correct arguments to `predicate`', () => {
    const callback = jasmine.createSpy('callback').and.returnValues(true, false, true);
    sequenz.list(sequenz.takeRightWhile(callback))(input);
    expect(callback.calls.allArgs()).toEqual([[1, 0], [2, 1], [3, 2]]);
  });
});
