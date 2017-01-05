import * as sequenz from '../src/index';
import { falsey, isNotUndefined, isEven, compose } from './utils';

/**
 * APIs to transform the sequenz, and might modify the origin key if necessary
 */

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
  it('should allow duplicated values in given sequenz', () => {
    const input = [1, 2, 3, 1, 2, 3];
    const actual = sequenz.list(sequenz.difference(1, 2))(input);
    expect(actual).toEqual([3, 3]);
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
  it('should use `equal` when `comparator` is not provided', () => {
    const input = [2, 1];
    const actual = sequenz.list(sequenz.differenceWith()([2, 3], [3, 4]))(input);
    expect(actual).toEqual([1]);
  });
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

describe('flatten:', () => {
  it('should flatten `arguments` objects', () => {
    (function () {
      const input = [1, 2, 3, arguments]; // eslint-disable-line
      const actual = sequenz.list(sequenz.flatten())(input);
      expect(actual).toEqual([1, 2, 3, 'a', 'b', 'c']);
    }('a', 'b', 'c'));
  });
  it('should support flattening of nested arrays', () => {
    const input = [1, [2, [3, [4]], 5]];
    const actual = sequenz.list(sequenz.flatten())(input);
    expect(actual).toEqual([1, 2, [3, [4]], 5]);
  });
  it('should work with empty arrays', () => {
    const input = [[], [[]], [[], [[[]]]]];
    const actual = sequenz.list(sequenz.flatten())(input);
    expect(actual).toEqual([[], [], [[[]]]]);
  });
  it('should not flatten string', () => {
    const input = ['flatten', 'string'];
    const actual = sequenz.list(sequenz.flatten())(input);
    expect(actual).toEqual(input);
  });
});

describe('flattenDeep:', () => {
  it('should flatten `arguments` objects', () => {
    (function () {
      const input = [1, 2, 3, arguments]; // eslint-disable-line
      const actual = sequenz.list(sequenz.flattenDeep())(input);
      expect(actual).toEqual([1, 2, 3, 'a', 'b', 'c']);
    }('a', 'b', 'c'));
  });
  it('should support flattening of nested arrays', () => {
    const input = [1, [2, [3, [4]], 5]];
    const actual = sequenz.list(sequenz.flattenDeep())(input);
    expect(actual).toEqual([1, 2, 3, 4, 5]);
  });
  it('should work with empty arrays', () => {
    const input = [[], [[]], [[], [[[]]]]];
    const actual = sequenz.list(sequenz.flattenDeep())(input);
    expect(actual).toEqual([]);
  });
  it('should not flatten string', () => {
    const input = ['flatten', 'string'];
    const actual = sequenz.list(sequenz.flattenDeep())(input);
    expect(actual).toEqual(input);
  });
});

describe('flattenDepth:', () => {
  it('should flatten `arguments` objects', () => {
    (function () {
      const input = [1, 2, 3, arguments]; // eslint-disable-line
      const actual = sequenz.list(sequenz.flattenDepth(1))(input);
      expect(actual).toEqual([1, 2, 3, 'a', 'b', 'c']);
    }('a', 'b', 'c'));
  });
  it('should support flattening of nested arrays', () => {
    const input = [1, [2, [3, [4]], 5]];
    const actual = sequenz.list(sequenz.flattenDepth(2))(input);
    expect(actual).toEqual([1, 2, 3, [4], 5]);
  });
  it('should work with empty arrays', () => {
    const input = [[], [[]], [[], [[[]]]]];
    const actual = sequenz.list(sequenz.flattenDepth(2))(input);
    expect(actual).toEqual([[[]]]);
  });
  it('should not flatten string', () => {
    const input = ['flatten', 'string'];
    const actual = sequenz.list(sequenz.flattenDepth(2))(input);
    expect(actual).toEqual(input);
  });
  it('should use a default `depth` of `1`', () => {
    const input = [1, [2, [3, [4]], 5]];
    const actual = sequenz.list(sequenz.flattenDepth())(input);
    expect(actual).toEqual([1, 2, [3, [4]], 5]);
  });
  it('should treat a `depth` of < `1` as a shallow clone', () => {
    const input = [1, [2, [3, [4]], 5]];
    const actual = sequenz.list(sequenz.flattenDepth(-1))(input);
    expect(actual).toEqual(input);
    expect(actual).not.toBe(input);
  });
  it('should coerce `depth` to an integer', () => {
    const input = [1, [2, [3, [4]], 5]];
    const actual = sequenz.list(sequenz.flattenDepth(2.8))(input);
    expect(actual).toEqual([1, 2, 3, [4], 5]);
  });
});

describe('fromPairs:', () => {
  it('should accept a two dimensional array and returns object', () => {
    const input = [['a', [1]], ['b', 2]];
    const actual = sequenz.list(sequenz.fromPairs())(input);
    expect(actual).toEqual({ a: [1], b: 2 });
  });
  it('should collapse if keys are the same', () => {
    const input = [['a', 'first'], ['a', 'second']];
    const actual = sequenz.list(sequenz.fromPairs())(input);
    expect(actual).toEqual({ a: 'second' });
  });
});

describe('groupBy:', () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  it('should group elements into sequenz of list', () => {
    const actual = sequenz.list(
      sequenz.groupBy(num => num % 3),
      sequenz.toObject
    )(input);
    expect(actual).toEqual({
      0: [3, 6, 9, 0],
      1: [1, 4, 7],
      2: [2, 5, 8],
    });
  });
  it('should be able to terminate sequenz', () => {
    const actual = sequenz.list(
      sequenz.groupBy(num => num % 3, () => sequenz.take(1)),
      sequenz.toObject
    )(input);
    expect(actual).toEqual({
      1: [1],
      2: [2],
      0: [3],
    });
  });
  it('should be able to terminate each inner sequenz differently', () => {
    const actual = sequenz.list(
      sequenz.groupBy(num => num % 3, key => sequenz.take(key + 1)),
      sequenz.toObject
    )(input);
    expect(actual).toEqual({
      0: [3],
      1: [1, 4],
      2: [2, 5, 8],
    });
  });
  it('should accept string as `iteratee` shortcut', () => {
    const list = [
      { name: 'anna', age: 12 },
      { name: 'ben', age: 14 },
      { name: 'claire', age: 12 },
      { name: 'danielle', age: 18 },
    ];
    const actual = sequenz.list(
      sequenz.groupBy('age'),
      sequenz.toObject
    )(list);
    expect(actual).toEqual({
      12: [list[0], list[2]],
      14: [list[1]],
      18: [list[3]],
    });
  });
});

describe('initial:', () => {
  it('should exclude last element', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.initial())(input);
    expect(actual).toEqual(input.slice(0, input.length - 1));
  });
  it('should return empty array when input array is empty', () => {
    const input = [];
    const actual = sequenz.list(sequenz.initial())(input);
    expect(actual).toEqual([]);
  });
});

describe('intersection:', () => {
  it('should only return elements in given array ', () => {
    const input = [2, 1];
    const actual = sequenz.list(sequenz.intersection([2, 3]))(input);
    expect(actual).toEqual([2]);
  });
  it('should work with multiple arrays as well', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.intersection([2, 3], [3, 4]))(input);
    expect(actual).toEqual([3]);
  });
  it('should work with sequenz as well', () => {
    const input = [2, 1];
    const actual = sequenz.list(sequenz.intersection(sequenz.fromIterable([2, 3])))(input);
    expect(actual).toEqual([2]);
  });
});

describe('intersectionBy:', () => {
  it('should use `identity` if `iteratee` is not provided', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.intersectionBy()([2, 3]))(input);
    expect(actual).toEqual([2, 3]);
  });
  it('should accept an `iteratee`', () => {
    const input = [2.1, 1.2];
    const actual = sequenz.list(sequenz.intersectionBy(Math.floor)([2.3, 3.4]))(input);
    expect(actual).toEqual([2.1]);
  });
  it('should work with multiple arrays as well', () => {
    const input = [2.1, 1.2, 3.3];
    const actual = sequenz.list(sequenz.intersectionBy(Math.floor)([2.3, 3.4], [3.5, 4.6]))(input);
    expect(actual).toEqual([3.3]);
  });
  it('should work with sequenz as well', () => {
    const input = [2.1, 1.2];
    const actual = sequenz.list(
      sequenz.intersectionBy(Math.floor)(sequenz.fromIterable([2.3, 3.4]))
    )(input);
    expect(actual).toEqual([2.1]);
  });
});

describe('intersectionWith:', () => {
  const comparator = (x, y) => Math.abs(x.x - y.x) + Math.abs(x.y - y.y);
  it('should use `equal` when `comparator` is not provided', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.intersectionWith()([2, 3], [3, 4]))(input);
    expect(actual).toEqual([3]);
  });
  it('should work with a `comparator`', () => {
    const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }];
    const actual = sequenz.list(
      sequenz.intersectionWith(comparator)([{ x: 1, y: 2 }])
    )(objects);
    expect(actual).toEqual([objects[0]]);
  });
  it('should work with multiple arrays as well', () => {
    const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }];
    const actual = sequenz.list(
      sequenz.intersectionWith(comparator)(
        [{ x: 1, y: 2 }, { x: 2, y: 1 }],
        [{ x: 2, y: -1 }, { x: 1, y: 2 }]
      )
    )(objects);
    expect(actual).toEqual([objects[0]]);
  });
  it('should work with sequenz as well', () => {
    const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }];
    const actual = sequenz.list(
      sequenz.intersectionWith(comparator)(sequenz.fromIterable([{ x: 1, y: 2 }]))
    )(objects);
    expect(actual).toEqual([objects[0]]);
  });
});

describe('invert:', () => {
  it('should invert `key` and `value` in `sequenz`', () => {
    const input = { a: '1', b: '2', c: '3' };
    const actual = sequenz.object(sequenz.invert())(input);
    expect(actual).toEqual({ 1: 'a', 2: 'b', 3: 'c' });
  });
  it('should convert new `key` to string', () => {
    const input = { a: 1, b: 2, c: 3 };
    const actual = sequenz.object(sequenz.invert())(input);
    expect(actual).toEqual({ 1: 'a', 2: 'b', 3: 'c' });
  });
  it('should provide `value` even when `key`s are the same', () => {
    const input = { a: 1, b: 1, c: 1 };
    const callback = jasmine.createSpy('callback');
    const actual = sequenz.object(sequenz.invert(), sequenz.intercept(callback))(input);
    expect(actual).toEqual({ 1: 'c' });
    expect(callback.calls.allArgs()).toEqual([
      ['a'/* value */, 1/* key */],
      ['b'/* value */, 1/* key */],
      ['c'/* value */, 1/* key */],
    ]);
  });
});

describe('keys:', () => {
  it('should use key as new element, while have the index as its new key', () => {
    const input = { a: 'a', b: 'b' };
    const actual = sequenz.object(sequenz.keys())(input);
    expect(actual).toEqual({ 0: 'a', 1: 'b' });
  });
});

describe('log:', () => {
  beforeEach(() => {
    spyOn(console, 'log');
  });
  it('should return original values and keys', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.log())(input);
    expect(actual).toEqual(input);
  });
  it('should call `console.log` on each iteration, when `value` and `key` as parameters', () => {
    const input = { key: 'value' };
    sequenz.object(sequenz.map(value => `${value},${value}`), sequenz.log())(input);
    expect(console.log).toHaveBeenCalledWith('value,value'/* value */, 'key'/* key */);
  });
});

describe('pairs:', () => {
  it('should convert bundle key and elements in group', () => {
    const input = { one: 1, two: 2 };
    let actual = sequenz.object(
      sequenz.pairs(),
      sequenz.toList
    )(input);
    expect(actual).toEqual([['one', 1], ['two', 2]], 'where input is object');
    actual = sequenz.list(sequenz.pairs())([1, 2]);
    expect(actual).toEqual([[0, 1], [1, 2]], 'where input is array');
  });
});

describe('partition:', () => {
  const input = [1, 2, 3, 4, 5];
  it('should split sequenz into two sequenz depending on `predicate` result', () => {
    const predicate = num => num % 2 === 0;
    const actual = sequenz.list(
      sequenz.partition(predicate),
      sequenz.toObject
    )(input);
    expect(actual).toEqual({
      truthy: [2, 4],
      falsey: [1, 3, 5],
    });
  });
  it('should convert predicate returns to boolean', () => {
    const predicate = num => num % 2;
    const actual = sequenz.list(
      sequenz.partition(predicate),
      sequenz.toObject,
    )(input);
    expect(actual).toEqual({
      falsey: [2, 4],
      truthy: [1, 3, 5],
    });
  });
  it('should accept transform generate as second param to transfer sequenz', () => {
    const predicate = num => num % 2;
    const actual = sequenz.list(
      sequenz.partition(predicate, () => sequenz.take(2)),
      sequenz.toObject
    )(input);
    expect(actual).toEqual({
      falsey: [2, 4],
      truthy: [1, 3],
    });
  });
});

describe('remove:', () => {
  it('should remove elements where `predicate` returns truthy for', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.remove(isEven))(input);
    expect(actual).toEqual([1, 3]);
  });
  it('should call `predicate` with both element and key/index', () => {
    const input = [1];
    const predicate = jasmine.createSpy('predicate');
    sequenz.list(sequenz.remove(predicate))(input);
    expect(predicate).toHaveBeenCalledWith(1 /* value */, 0 /* index */);

    const object = { a: 1 };
    sequenz.object(sequenz.remove(predicate))(object);
    expect(predicate).toHaveBeenCalledWith(1 /* value */, 'a' /* key */);
  });
  it('should use `identity` if `predicate` is not provided', () => {
    const input = [0, 1, true, false];
    const actual = sequenz.list(sequenz.remove())(input);
    expect(actual).toEqual([0, false]);
  });
  it('should have an alias `reject`', () => {
    expect(sequenz.remove).toBe(sequenz.reject);
  });
});

describe('reverse:', () => {
  it('should reverse the `sequenz`', () => {
    const input = [1, 2, 3, 4];
    const actual = sequenz.list(sequenz.reverse())(input);
    expect(actual).toEqual([4, 3, 2, 1]);
  });
  it('should be able to terminate manually', () => {
    const input = [1, 2, 3, 4];
    const actual = sequenz.list(sequenz.reverse(), sequenz.take(2))(input);
    expect(actual).toEqual([4, 3]);
  });
});

describe('slice:', () => {
  const input = [1, 2, 3, 4, 5];
  it('should copy the `sequenz` if none param is provided', () => {
    const actual = sequenz.list(sequenz.slice())(input);
    expect(actual).toEqual(input);
    expect(actual).not.toBe(input);
  });
  it('should work with a positive `start`', () => {
    const actual = sequenz.list(sequenz.slice(1))(input);
    expect(actual).toEqual(input.slice(1));
  });
  it('should work with a `start` >= `length` of sequenz', () => {
    const actual = sequenz.list(sequenz.slice(10))(input);
    expect(actual).toEqual([]);
  });
  it('should work with a `start` >= `end`', () => {
    const actual = sequenz.list(sequenz.slice(2, 1))(input);
    expect(actual).toEqual([]);
  });
  it('should work with a positive `end`', () => {
    const actual = sequenz.list(sequenz.slice(1, 3))(input);
    expect(actual).toEqual(input.slice(1, 3));
  });
  it('should work with `end` >= `length`', () => {
    const actual = sequenz.list(sequenz.slice(1, 10))(input);
    expect(actual).toEqual(input.slice(1));
  });
  it('should work with negative `start`', () => {
    const actual = sequenz.list(sequenz.slice(-1))(input);
    expect(actual).toEqual([5]);
  });
  it('should work with negative `start` <= negative `length`', () => {
    [-5, -6, -Infinity].forEach((value) => {
      const actual = sequenz.list(sequenz.slice(value))(input);
      expect(actual).toEqual(input);
    });
  });
  it('should work with negaive `end`', () => {
    const actual = sequenz.list(sequenz.slice(1, -1))(input);
    expect(actual).toEqual([2, 3, 4]);
  });
  it('should work with a negative `end` <= negative `length`', () => {
    [-5, -6, -Infinity].forEach((value) => {
      const actual = sequenz.list(sequenz.slice(0, value))(input);
      expect(actual).toEqual([], `where end is ${value}`);
    });
  });
  it('should work with both negative `start` and `end`', () => {
    const actual = sequenz.list(sequenz.slice(-3, -1))(input);
    expect(actual).toEqual([3, 4]);
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
  it('should use `num` = 1 if not specified', () => {
    const actual = sequenz.list(sequenz.skipRight())(input);
    expect(actual).toEqual(input.slice(0, input.length - 1));
  });
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
  it('should skip element in tail if satisfied `predicate`', () => {
    const input = [1, 2, 2, 3];
    const actual = sequenz.list(sequenz.skipRightWhile(x => x % 3 < 2))(input);
    expect(actual).toEqual([1, 2, 2]);
  });
  it('should provide correct `predicate` arguments', () => {
    const input = [1, 2, 3, 4];
    const callback = jasmine.createSpy('callback').and.returnValues(true, false, true, false);
    sequenz.list(sequenz.skipRightWhile(callback))(input);
    expect(callback).toHaveBeenCalledTimes(4);
    expect(callback.calls.allArgs()).toEqual(input.map((value, i) => [value, i]));
  });
  it('should use `identity` if `predicate` not provided', () => {
    const input = [true, false, 0, 1];
    const actual = sequenz.list(sequenz.skipRightWhile())(input);
    expect(actual).toEqual([true, false, 0]);
  });
});

describe('sortedUniq', () => {
  it('should return uniq elements, where `iteratee` will be invoked before compare', () => {
    const input = [1, 2, 2, 3, 3, 3];
    const actual = sequenz.list(sequenz.sortedUniq())(input);
    expect(actual).toEqual([1, 2, 3]);
  });
});

describe('sortedUniqBy', () => {
  it('should return uniq elements, where `iteratee` will be invoked before compare', () => {
    const input = [0, 5, 1, 6, 7, 2, 12, 3];
    const actual = sequenz.list(sequenz.sortedUniqBy(x => x % 5))(input);
    expect(actual).toEqual([0, 1, 7, 3]);
  });
  it('should provide correct arguments to `iteratee`', () => {
    const input = [0, 5];
    const iteratee = jasmine.createSpy('iteratee', x => x).and.callThrough();
    sequenz.list(sequenz.sortedUniqBy(iteratee))(input);
    expect(iteratee.calls.allArgs()).toEqual([
      [0, 0],
      [5, 1],
    ]);
  });
});

describe('tail:', () => {
  it('should exclude first element', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.tail())(input);
    expect(actual).toEqual(input.slice(1));
  });
  it('should return empty array when input array is empty', () => {
    const input = [];
    const actual = sequenz.list(sequenz.tail())(input);
    expect(actual).toEqual([]);
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
  it('should use `identity` if `prediate` not provided', () => {
    const actual = sequenz.list(sequenz.takeWhile())([-1, 0, 1, 2]);
    expect(actual).toEqual([-1]);
  });
});

describe('takeRightWhile:', () => {
  const input = [1, 2, 2, 3];
  it('should take elements while `predicate` returns truthy', () => {
    const actual = sequenz.list(sequenz.takeRightWhile(n => n % 2 === 1))(input);
    expect(actual).toEqual([3]);
  });
  it('should provide correct arguments to `predicate`', () => {
    const callback = jasmine.createSpy('callback').and.returnValues(true, false, true);
    sequenz.list(sequenz.takeRightWhile(callback))(input);
    expect(callback.calls.allArgs()).toEqual([[1, 0], [2, 1], [2, 2], [3, 3]]);
  });
  it('should use `identity` if `prediate` not provided', () => {
    const actual = sequenz.list(sequenz.takeRightWhile())([-1, 0, 1, 2]);
    expect(actual).toEqual([1, 2]);
  });
});

describe('union:', () => {
  it('should only return elements in one time', () => {
    const input = [2, 1, 1];
    const actual = sequenz.list(sequenz.union([3, 2, 3]))(input);
    expect(actual).toEqual([2, 1, 3]);
  });
  it('should work with multiple arrays as well', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.union([2, 3], [3, 4]))(input);
    expect(actual).toEqual([1, 2, 3, 4]);
  });
  it('should work with sequenz as well', () => {
    const input = [2, 1];
    const actual = sequenz.list(sequenz.union(sequenz.fromIterable([4, 2, 3])))(input);
    expect(actual).toEqual([2, 1, 4, 3]);
  });
});

describe('unionBy:', () => {
  it('should use `identity` if `iteratee` is not provided', () => {
    const input = [1, 2];
    const actual = sequenz.list(sequenz.unionBy()([2, 3]))(input);
    expect(actual).toEqual([1, 2, 3]);
  });
  it('should accept an `iteratee`', () => {
    const input = [2.1, 1.2];
    const actual = sequenz.list(sequenz.unionBy(Math.floor)([2.3, 3.4]))(input);
    expect(actual).toEqual([2.1, 1.2, 3.4]);
  });
  it('should work with multiple arrays as well', () => {
    const input = [2.1, 1.2, 3.3];
    const actual = sequenz.list(sequenz.unionBy(Math.floor)([2.3, 3.4], [3.5, 4.6]))(input);
    expect(actual).toEqual([2.1, 1.2, 3.3, 4.6]);
  });
  it('should work with sequenz as well', () => {
    const input = [2.1, 1.2];
    const actual = sequenz.list(
      sequenz.unionBy(Math.floor)(sequenz.fromIterable([2.3, 3.4]))
    )(input);
    expect(actual).toEqual([2.1, 1.2, 3.4]);
  });
});

describe('unionWith:', () => {
  const comparator = (x, y) => Math.abs(x.x - y.x) + Math.abs(x.y - y.y);
  it('should use `equal` when `comparator` is not provided', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.unionWith()([2, 3], [3, 4]))(input);
    expect(actual).toEqual([1, 2, 3, 4]);
  });
  it('should work with a `comparator`', () => {
    const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }];
    const actual = sequenz.list(
      sequenz.unionWith(comparator)([{ x: 1, y: 2 }])
    )(objects);
    expect(actual).toEqual(objects);
  });
  it('should work with multiple arrays as well', () => {
    const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }];
    const another = [{ x: 1, y: -2 }];
    const actual = sequenz.list(
      sequenz.unionWith(comparator)([{ x: 1, y: 2 }], another)
    )(objects);
    expect(actual).toEqual(objects.concat(another));
  });
  it('should work with sequenz as well', () => {
    const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }];
    const actual = sequenz.list(
      sequenz.unionWith(comparator)(sequenz.fromIterable([{ x: 1, y: 2 }]))
    )(objects);
    expect(actual).toEqual(objects);
  });
});

describe('uniq:', () => {
  it('should only return elements in one time', () => {
    const input = [1, 2, 3, 2, 1, 3, 2];
    const actual = sequenz.list(sequenz.uniq())(input);
    expect(actual).toEqual([1, 2, 3]);
  });
  it('should only return elements one time (complex scenario)', () => {
    const input = [1, 1, '1', '1', 0, 0, '0', '0', undefined, undefined, null, null, NaN, NaN];
    const actual = sequenz.list(sequenz.uniq())(input);
    expect(actual).toEqual([1, '1', 0, '0', undefined, null, NaN]);
  });
});

describe('uniqBy:', () => {
  it('should use `identity` if `iteratee` is not provided', () => {
    const input = [1, 2, 3, 3, 2, 1];
    const actual = sequenz.list(sequenz.uniqBy())(input);
    expect(actual).toEqual([1, 2, 3]);
  });
  it('should accept an `iteratee`', () => {
    const input = [2.1, 1.2, 2.3, 3.4];
    const actual = sequenz.list(sequenz.uniqBy(Math.floor))(input);
    expect(actual).toEqual([2.1, 1.2, 3.4]);
  });
});

describe('uniqWith:', () => {
  const comparator = (x, y) => Math.abs(x.x - y.x) + Math.abs(x.y - y.y);
  it('should use `equal` if `comparator` is not provided', () => {
    const input = [1, 2, 3, 3, 2, 1];
    const actual = sequenz.list(sequenz.uniqWith())(input);
    expect(actual).toEqual([1, 2, 3]);
  });
  it('should work with a `comparator`', () => {
    const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }, { x: 1, y: 2 }];
    const actual = sequenz.list(
      sequenz.uniqWith(comparator)
    )(objects);
    expect(actual).toEqual(objects.slice(0, 2));
  });
});

describe('without:', () => {
  it('should return the difference of values', () => {
    const input = [2, 1, 2, 3];
    const actual = sequenz.list(sequenz.without(1, 2))(input);
    expect(actual).toEqual([3]);
  });
  it('should use strict equality to determine the values to reject', () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    const input = [obj1, obj2];
    let actual = sequenz.list(sequenz.without({ a: 1 }))(input);
    expect(actual).toEqual(input);
    actual = sequenz.list(sequenz.without(obj1))(input);
    expect(actual).toEqual([obj2]);
  });
  it('should remove all occurrences of each value from an array', () => {
    const input = [1, 2, 3, 1, 2, 3];
    const actual = sequenz.list(sequenz.without(1, 2))(input);
    expect(actual).toEqual([3, 3]);
  });
});

describe('where:', () => {
  it('should select all elements which matches the given `properties`', () => {
    const input = [
      { name: 'anna', age: 40, gender: 'female' },
      { name: 'ben', age: 50, gender: 'male' },
      { name: 'chris', age: 60, gender: 'male' },
    ];
    const actual = sequenz.list(sequenz.where({ gender: 'female' }))(input);
    expect(actual).toEqual([input[0]]);
    expect(actual[0]).toBe(input[0]);
  });
  it('should not use property in prototype chain', () => {
    const input = [
      { name: 'anna', age: 40, gender: 'female' },
      { name: 'ben', age: 50, gender: 'male' },
      { name: 'chris', age: 60, gender: 'male' },
    ];
    const actual = sequenz.list(sequenz.where({ toString: Object.prototype.toString }))(input);
    expect(actual).toEqual([]);
  });
});

describe('unzip:', () => {
  const input = [
    [1, 2],
    [3, 4, 5],
    [6],
    [7, 8],
    [9, 0],
  ];
  it('should group elements into sequenz of list', () => {
    const actual = sequenz.list(
      sequenz.unzip(),
      sequenz.toList
    )(input);
    expect(actual).toEqual([
      [1, 3, 6, 7, 9],
      [2, 4, undefined, 8, 0],
    ]);
  });
  it('should be able to terminate sequenz', () => {
    const actual = sequenz.list(
      sequenz.unzip(() => sequenz.take(3))
    )(input);
    expect(actual).toEqual([
      [1, 3, 6],
      [2, 4, undefined],
    ]);
  });
  it('should be able to terminate each inner sequenz differently', () => {
    const actual = sequenz.list(
      sequenz.unzip((index) => sequenz.take(index + 1))
    )(input);
    expect(actual).toEqual([
      [1],
      [2, 4],
    ]);
  });
  it('should result in empty sequenz, if first element is empty array', () => {
    const actual = sequenz.list(
      sequenz.unzip()
    )([[], [1], [2]]);
    expect(actual).toEqual([]);
  });
});

describe('zip:', () => {
  const input1 = [1, 2, 3];
  const input2 = [4, 5, 6];
  it('should group elements from sequenz and each array into a new element', () => {
    const input = [7, 8, 9];
    const actual = sequenz.list(sequenz.zip(input1, input2))(input);
    expect(actual).toEqual([
      [7, 1, 4],
      [8, 2, 5],
      [9, 3, 6],
    ]);
  });
  it('should use undefined if certain element cannot be found', () => {
    const input = [7, 8, 9, 0];
    const actual = sequenz.list(sequenz.zip(input1, input2))(input);
    expect(actual).toEqual([
      [7, 1, 4],
      [8, 2, 5],
      [9, 3, 6],
      [0, undefined, undefined],
    ]);
  });
  it('should have same `length` for sequenz', () => {
    const input = [7];
    const actual = sequenz.list(sequenz.zip(input1, input2))(input);
    expect(actual).toEqual([
      [7, 1, 4],
    ]);
  });
});

describe('zipObject:', () => {
  it('should use keys from given array and values from sequenz', () => {
    const keys = ['a', 'b', 'c'];
    const input = [1, 2];
    const actual = sequenz.list(sequenz.zipObject(keys), sequenz.toObject)(input);
    expect(actual).toEqual({ a: 1, b: 2 });
  });
  it('should terminate early if keys are not enough', () => {
    const keys = ['a'];
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.zipObject(keys), sequenz.toObject)(input);
    expect(actual).toEqual({ a: 1 });
  });
  it('should terminate early if manually stops the iteration', () => {
    const keys = ['a', 'b', 'c'];
    const input = [1, 2, 3];
    const actual = sequenz.list(
      sequenz.zipObject(keys),
      sequenz.takeWhile(element => element <= 2),
      sequenz.toObject
    )(input);
    expect(actual).toEqual({ a: 1, b: 2 });
  });
});
