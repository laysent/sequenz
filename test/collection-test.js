const sequenz = require('../lib/index');
const { identity, empty } = require('./utils');

/**
 * APIs to transform the sequenz, and do NOT modify the origin key
 */

describe('functions:', () => {
  it('should keep only the functions', () => {
    const input = { a: 'a', b: identity, c: /x/, d: empty };
    const actual = sequenz.object(sequenz.functions())(input);
    expect(actual).toEqual({ b: identity, d: empty });
  });
  it('should not include inherited functions', () => {
    function Foo() {
      this.a = identity;
      this.b = 'b';
    }
    Foo.prototype.c = empty;
    const actual = sequenz.object(sequenz.functions())(new Foo());
    expect(actual).toEqual({ a: identity });
  });
});

describe('map:', () => {
  it('should map values using `iteratee`', () => {
    const input = [1, 2, 3];
    const actual = sequenz.list(sequenz.map((value, key) => value + key))(input);
    expect(actual).toEqual(input.map((value, key) => value + key));
  });
});

describe('pickBy:', () => {
  it('should work with a predicate argument', () => {
    const object = { a: 1, b: 2, c: 3, d: 4, e: 5 };
    const actual = sequenz.object(sequenz.pickBy(n => n === 1 || n === 3))(object);
    expect(actual).toEqual({ a: 1, c: 3 });
  });
  it('should pass both value and key to predicate', () => {
    const object = { a: 1 };
    const predicate = jasmine.createSpy('predicate');
    sequenz.object(sequenz.pickBy(predicate))(object);
    expect(predicate).toHaveBeenCalledTimes(1 /* value */, 'a' /* key */);
  });
});

describe('pluck:', () => {
  it('should pull specified property out of each element', () => {
    const input = [
      { name: 'anna', age: 40 },
      { name: 'ben', age: 50 },
      { name: 'chris', age: 60 },
    ];
    const actual = sequenz.list(sequenz.pluck('name'))(input);
    expect(actual).toEqual(['anna', 'ben', 'chris']);
  });
  it('should new value will be `undefined` if property does not exist in certain element', () => {
    const input = [
      { name: 'anna', age: 40 },
      { name: 'ben', age: 50 },
      { age: 55 },
      { name: 'chris', age: 60 },
    ];
    const actual = sequenz.list(sequenz.pluck('name'))(input);
    expect(actual).toEqual(['anna', 'ben', undefined, 'chris']);
  });
});

describe('scan:', () => {
  const input = [1, 2, 3];
  it('should accumulate each element with previous result to create new element', () => {
    const actual = sequenz.list(sequenz.scan((prev, curr) => prev + curr, -1))(input);
    expect(actual).toEqual([0, 2, 5]);
  });
  it('should use first element directly, if no initial value provided', () => {
    const actual = sequenz.list(sequenz.scan((prev, curr) => prev + curr))(input);
    expect(actual).toEqual([1, 3, 6]);
  });
  it('should provide correct `iteratee` arguments, when no intial value provided', () => {
    const callback = jasmine.createSpy('callback').and.returnValue(0);
    sequenz.list(sequenz.scan(callback))(input);
    expect(callback.calls.allArgs()).toEqual([
      [1/* previous value */, 2 /* current value */, 1/* current key */],
      [0/* previous value */, 3 /* current value */, 2/* current key */],
    ]);
  });
  it('should provide correct `iteratee` arguments, when intial value is provided', () => {
    const callback = jasmine.createSpy('callback').and.returnValue(0);
    sequenz.list(sequenz.scan(callback, -1))(input);
    expect(callback.calls.allArgs()).toEqual([
      [-1/* previous value */, 1 /* current value */, 0/* current key */],
      [0/* previous value */, 2 /* current value */, 1/* current key */],
      [0/* previous value */, 3 /* current value */, 2/* current key */],
    ]);
  });
  it('should preserve the key of each element', () => {
    const object = { a: 1, b: 2, c: 3 };
    const actual = sequenz.object(sequenz.scan((prev, curr) => prev + curr, 0))(object);
    expect(actual).toEqual({ a: 1, b: 3, c: 6 });
  });
});
