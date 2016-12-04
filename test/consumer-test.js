import * as sequenz from '../src/index';
import { falsey } from './utils';

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

describe('first:', () => {
  it('should return the first element', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.first())(input);
    expect(actual).toBe(1);
  });
  it('should return `undefined` for empty array', () => {
    const input = [];
    const actual = sequenz.list(sequenz.first())(input);
    expect(actual).toBeUndefined();
  });
  it('should have an alias `head`', () => {
    expect(sequenz.first).toBe(sequenz.head);
  });
});

describe('firstOrDefault:', () => {
  it('should return the first element', () => {
    const input = [1, 2, 3];
    const value = { };
    const actual = sequenz.list(sequenz.firstOrDefault(value))(input);
    expect(actual).toBe(1);
  });
  it('should return default value for empty array', () => {
    const input = [];
    const value = { };
    const actual = sequenz.list(sequenz.firstOrDefault(value))(input);
    expect(actual).toBe(value);
  });
});

describe('findWhere:', () => {
  it('should find first element where given properties match', () => {
    const properties = { x: 1, y: 2 };
    const expected = { x: 1, y: 2, z: 3 };
    const input = [
      { x: 1, y: 1, z: 1 },
      { x: 2, y: 2, z: 2 },
      expected,
      { x: 3, y: 2, z: 1 },
    ];
    const actual = sequenz.list(sequenz.findWhere(properties))(input);
    expect(actual).toBe(expected);
  });
  it('should return `undefined` if no match found', () => {
    const properties = { x: 1, y: 2 };
    const input = [
      { x: 1, y: 1, z: 1 },
      { x: 2, y: 2, z: 2 },
      { x: 3, y: 2, z: 1 },
    ];
    const actual = sequenz.list(sequenz.findWhere(properties))(input);
    expect(actual).toBeUndefined();
  });
});

describe('indexBy:', () => {
  it('should return an object with `key` provided by `iteratee`', () => {
    const input = [
      { name: 'anna', age: 40 },
      { name: 'ben', age: 50 },
      { name: 'chris', age: 60 },
    ];
    const actual = sequenz.list(sequenz.indexBy(element => element.age))(input);
    expect(actual).toEqual({
      40: { name: 'anna', age: 40 },
      50: { name: 'ben', age: 50 },
      60: { name: 'chris', age: 60 },
    });
    expect(actual[40]).toBe(input[0]);
    expect(actual[50]).toBe(input[1]);
    expect(actual[60]).toBe(input[2]);
  });
  it('should accept string as input, use it as property of each element to get `key`', () => {
    const input = [
      { name: 'anna', age: 40 },
      { name: 'ben', age: 50 },
      { name: 'chris', age: 60 },
    ];
    const actual = sequenz.list(sequenz.indexBy('age'))(input);
    expect(actual).toEqual({
      40: { name: 'anna', age: 40 },
      50: { name: 'ben', age: 50 },
      60: { name: 'chris', age: 60 },
    });
    expect(actual[40]).toBe(input[0]);
    expect(actual[50]).toBe(input[1]);
    expect(actual[60]).toBe(input[2]);
  });
  it('should warn in non-production mode when key are not uniq', () => {
    const input = [
      { name: 'anna', age: 40 },
      { name: 'ben', age: 50 },
      { name: 'chris', age: 40 },
    ];
    spyOn(console, 'warn');
    process.env.NODE_ENV = 'developement';
    sequenz.list(sequenz.indexBy('age'))(input);
    expect(console.warn).toHaveBeenCalledTimes(1);

    process.env.NODE_ENV = 'production';
    sequenz.list(sequenz.indexBy('age'))(input);
    expect(console.warn).toHaveBeenCalledTimes(1);

    process.env.NODE_ENV = 'development';
  });
});

describe('indexOf:', () => {
  const input = ['one', 'two', 'three'];
  it('should return index of element if found', () => {
    [undefined, -1, 0, 1].forEach((fromIndex) => {
      const actual = sequenz.list(
        fromIndex === undefined ? sequenz.indexOf('two') : sequenz.indexOf('two', fromIndex)
      )(input);
      expect(actual).toBe(1, `where fromIndex is ${fromIndex}`);
    });
  });
  it('should return `-1` if not found', () => {
    [undefined, -1, 0, 1].forEach((fromIndex) => {
      const actual = sequenz.list(
        fromIndex === undefined ? sequenz.indexOf('zero') : sequenz.indexOf('zero', fromIndex)
      )(input);
      expect(actual).toBe(-1, `where fromIndex is ${fromIndex}`);
    });
  });
  it('should coerce `fromIndex` to an integer', () => {
    [-1.9, 1.9].forEach((fromIndex) => {
      const actual = sequenz.list(
        fromIndex === undefined ? sequenz.indexOf('two') : sequenz.indexOf('two', fromIndex)
      )(input);
      expect(actual).toBe(1, `where fromIndex is ${fromIndex}`);
    });
  });
  it('should work with |`fromIndex`| >= `length`', () => {
    [-3, -4, -100, -Infinity, 3, 4, 100, Infinity].forEach((fromIndex) => {
      const actual = sequenz.list(sequenz.indexOf('one', fromIndex))(input);
      expect(actual).toBe(-1, `where fromIndex is ${fromIndex}`);
    });
  });
});

describe('join:', () => {
  it('should convert `sequenz` to array and then join together using separator', () => {
    const input = ['a', 'b', 'c'];
    const actual = sequenz.list(sequenz.join('!'))(input);
    expect(actual).toBe('a!b!c');
  });
  it('should use "," as separator when not specified', () => {
    const input = ['a', 'b', 'c'];
    const actual = sequenz.list(sequenz.join())(input);
    expect(actual).toBe('a,b,c');
  });
});

describe('last:', () => {
  it('should return the last element', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.last())(input);
    expect(actual).toBe(3);
  });
  it('should return `undefined` for empty array', () => {
    const input = [];
    const actual = sequenz.list(sequenz.last())(input);
    expect(actual).toBeUndefined();
  });
});

describe('lastIndexOf:', () => {
  const input = ['one', 'two', 'three', 'one', 'two', 'three'];
  it('should return index of element if found', () => {
    [undefined, 0, 1, 3].forEach((fromIndex) => {
      const actual = sequenz.list(
        fromIndex === undefined ? sequenz.lastIndexOf('two') : sequenz.lastIndexOf('two', fromIndex)
      )(input);
      expect(actual).toBe(4, `where fromIndex is ${fromIndex}`);
    });
  });
  it('should return `-1` if not found', () => {
    [undefined, 0, 1].forEach((fromIndex) => {
      const actual = sequenz.list(
        fromIndex === undefined ?
        sequenz.lastIndexOf('zero') : sequenz.lastIndexOf('zero', fromIndex)
      )(input);
      expect(actual).toBe(-1, `where fromIndex is ${fromIndex}`);
    });
  });
  it('should coerce `fromIndex` to an integer', () => {
    [1.9, 3.9].forEach((fromIndex) => {
      const actual = sequenz.list(
        fromIndex === undefined ? sequenz.lastIndexOf('two') : sequenz.lastIndexOf('two', fromIndex)
      )(input);
      expect(actual).toBe(4, `where fromIndex is ${fromIndex}`);
    });
  });
  it('should work with |`fromIndex`| >= `length`', () => {
    [6, 7, 100, Infinity].forEach((fromIndex) => {
      const actual = sequenz.list(sequenz.lastIndexOf('one', fromIndex))(input);
      expect(actual).toBe(-1, `where fromIndex is ${fromIndex}`);
    });
  });
});

describe('lastOrDefault:', () => {
  it('should return the last element', () => {
    const input = [1, 2, 3];
    const value = { };
    const actual = sequenz.list(sequenz.lastOrDefault(value))(input);
    expect(actual).toBe(3);
  });
  it('should return default value for empty array', () => {
    const input = [];
    const value = { };
    const actual = sequenz.list(sequenz.lastOrDefault(value))(input);
    expect(actual).toBe(value);
  });
});

describe('max:', () => {
  it('should return the maximum value of given `sequenz`', () => {
    const input = [1, 5, 2, 4];
    const actual = sequenz.list(sequenz.max())(input);
    expect(actual).toBe(5);
  });
  it('should return `undefined` when `sequenz` is empty', () => {
    const input = [];
    const actual = sequenz.list(sequenz.max())(input);
    expect(actual).toBeUndefined();
  });
  it('should use `iteratee` to calculate `rank` of each element', () => {
    const input = [1, 2, 3, 4, 5];
    const actual = sequenz.list(sequenz.max((element, index) => (index + element) % 3))(input);
    expect(actual).toBe(3, '(3 + 2) % 3 === 2 is the largest rank');
  });
  it('should ignore all values if rank is not a number', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.max(element => (element === 3 ? 'three' : element)))(input);
    expect(actual).toBe(2);
  });
  it('should return `undefined` if all ranks are not numbers', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.max(() => true))(input);
    expect(actual).toBeUndefined();
  });
});

describe('min:', () => {
  it('should return the minimum value of given `sequenz`', () => {
    const input = [2, 5, 1, 4];
    const actual = sequenz.list(sequenz.min())(input);
    expect(actual).toBe(1);
  });
  it('should return `undefined` when `sequenz` is empty', () => {
    const input = [];
    const actual = sequenz.list(sequenz.min())(input);
    expect(actual).toBeUndefined();
  });
  it('should use `iteratee` to calculate `rank` of each element', () => {
    const input = [2, 1, 4, 3, 5];
    const actual = sequenz.list(sequenz.min((element, index) => (index + element) % 3))(input);
    expect(actual).toBe(4, '(4 + 2) % 3 === 0 is the smallest rank');
  });
  it('should ignore all values if rank is not a number', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.min(element => (element === 1 ? 'one' : element)))(input);
    expect(actual).toBe(2);
  });
  it('should return `undefined` if all ranks are not numbers', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.min(() => true))(input);
    expect(actual).toBeUndefined();
  });
});

describe('nth:', () => {
  it('should return nth element of `sequenz`, where n starts from 1', () => {
    const input = [1, 2, 3, 4];
    const actual = sequenz.list(sequenz.nth(2))(input);
    expect(actual).toBe(2);
  });
  it('should return `undefined` if `index` > `length`', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.nth(4))(input);
    expect(actual).toBeUndefined();
  });
  it('should work with a negative `n`', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.nth(-1))(input);
    expect(actual).toBe(3);
  });
  it('should coerce `n` to an integer', () => {
    const input = [1, 2, 3];
    let actual = sequenz.list(sequenz.nth(1.9))(input);
    expect(actual).toBe(1);
    actual = sequenz.list(sequenz.nth(-1.9))(input);
    expect(actual).toBe(3);
  });
  it('should use `0` if `n` not provided', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.nth())(input);
    expect(actual).toBe(1);
  });
});

describe('reduce:', () => {
  const input = [1, 2, 3];
  it('should use the first element as default initial value, if not provided manullay', () => {
    const actual = sequenz.list(sequenz.reduce((prev, curr) => prev + curr))(input);
    expect(actual).toBe(6);
  });
  it('should use initial value if provided', () => {
    const actual = sequenz.list(sequenz.reduce((prev, curr) => prev + curr, 100))(input);
    expect(actual).toBe(106);
  });
  it('should provide correct `iteratee` arguments, when no intial value provided', () => {
    const callback = jasmine.createSpy('callback').and.returnValue(0);
    sequenz.list(sequenz.reduce(callback))(input);
    expect(callback.calls.allArgs()).toEqual([
      [1/* previous value */, 2 /* current value */, 1/* current key */],
      [0/* previous value */, 3 /* current value */, 2/* current key */],
    ]);
  });
  it('should provide correct `iteratee` arguments, when intial value is provided', () => {
    const callback = jasmine.createSpy('callback').and.returnValue(0);
    sequenz.list(sequenz.reduce(callback, -1))(input);
    expect(callback.calls.allArgs()).toEqual([
      [-1/* previous value */, 1 /* current value */, 0/* current key */],
      [0/* previous value */, 2 /* current value */, 1/* current key */],
      [0/* previous value */, 3 /* current value */, 2/* current key */],
    ]);
  });
});

describe('size:', () => {
  it('should return the size of `sequenz`', () => {
    const input = [1, 2, 3];
    const object = { a: 1, b: 2, c: 3 };
    let actual = sequenz.list(sequenz.size())(input);
    expect(actual).toBe(input.length);
    actual = sequenz.object(sequenz.size())(object);
    expect(actual).toBe(Object.keys(object).length);
  });
});

describe('some:', () => {
  it('should return `false` if `predicate` returns falsey for all elements', () => {
    const input = [true, 1, 'a'];
    const actual = sequenz.list(sequenz.some(x => !x))(input);
    expect(actual).toBe(false);
  });
  it('should return `false` for empty collections', () => {
    const input = [];
    const actual = sequenz.list(sequenz.some(() => true))(input);
    expect(actual).toBe(false);
  });
  it('should return `true` as soon as `predicate` returns truthy', () => {
    const input = [1, 2, 3, 4, 5];
    const callback = jasmine.createSpy('callback').and.returnValue(true);
    const actual = sequenz.list(sequenz.some(callback))(input);
    expect(actual).toBe(true);
    expect(callback).toHaveBeenCalledTimes(1);
  });
  it('should work with collections of `undefined` values (test in IE < 9)', () => {
    const actual = sequenz.list(sequenz.some(x => x))([undefined, undefined, undefined]);
    expect(actual).toBe(false);
  });
  it('should use `identity` when `predicate` is undefined', () => {
    const input = [0];
    expect(sequenz.list(sequenz.some())(input)).toBe(false);
    expect(sequenz.list(sequenz.some(undefined))(input)).toBe(false);
  });
});
