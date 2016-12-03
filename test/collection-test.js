import * as sequenz from '../src/index';
import { identity, empty } from './utils';

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
