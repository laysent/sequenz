import * as sequenz from '../src/index';

describe('range:', () => {
  it('should work with only `stop` specified', () => {
    const actual = sequenz.toList((sequenz.range(3)));
    expect(actual).toEqual([0, 1, 2]);
  });
  it('should work with both `start` and `stop` specified', () => {
    const actual = sequenz.toList((sequenz.range(2, 4)));
    expect(actual).toEqual([2, 3]);
  });
  it('should work with `start`, `stop` and `step` specified', () => {
    const actual = sequenz.toList((sequenz.range(0, 10, 4)));
    expect(actual).toEqual([0, 4, 8]);
  });
  it('should work when no param is specified', () => {
    const actual = sequenz.list(
      () => sequenz.range(),
      sequenz.take(2)
    )();
    expect(actual).toEqual([0, 1]);
  });
});

describe('repeat:', () => {
  it('should work with both `element` and `times` provided', () => {
    const object = {};
    const actual = sequenz.toList(sequenz.repeat(object, 2));
    expect(actual).toEqual([object, object]);
    actual.forEach((value, i) => {
      expect(value).toBe(object, `index ${i}`);
    });
  });
  it('should work when `times` is not specified, use 1 as default value', () => {
    const object = {};
    const actual = sequenz.toList(sequenz.repeat(object));
    expect(actual).toEqual([object]);
    actual.forEach((value, i) => {
      expect(value).toBe(object, `index ${i}`);
    });
  });
  it('should generate empty `sequenz` when `times` <= 0', () => {
    const object = {};
    [0, -1, -Infinity].forEach((times) => {
      const actual = sequenz.toList(sequenz.repeat(object, times));
      expect(actual).toEqual([]);
    });
  });
  it('should coerce `times` to an integer', () => {
    const object = { };
    const actual = sequenz.toList(sequenz.repeat(object, 2.9));
    expect(actual).toEqual([object, object]);
    actual.forEach((value, i) => {
      expect(value).toBe(object, `index ${i}`);
    });
  });
});
