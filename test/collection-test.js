import * as sequenz from '../src/index';

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
