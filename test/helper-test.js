import * as sequenz from '../src/index';

describe('list:', () => {
  const input = [1, 2, 3];
  it('should take array-like element as input and convert final sequenz to array', () => {
    const actual = sequenz.list(sequenz.map(x => x + 1))(input);
    expect(actual).toEqual([2, 3, 4]);
    (function () {
      const result = sequenz.list(sequenz.map(x => x + 1))(arguments); // eslint-disable-line
      expect(result).toEqual([2, 3, 4]);
    }(1, 2, 3));
  });
  it('should take array-like element as input and return result if it has been consumed', () => {
    const actual = sequenz.list(sequenz.first())(input);
    expect(actual).toBe(1);
  });
});

describe('string:', () => {
  const input = 'abc';
  it('should take string as input and convert final sequenz to string', () => {
    const actual = sequenz.string(
      sequenz.map(ch => String.fromCharCode(ch.charCodeAt(0) + 1))
    )(input);
    expect(actual).toEqual('bcd');
  });
  it('should take string as input and return result if it has been consumed', () => {
    const actual = sequenz.string(sequenz.first())(input);
    expect(actual).toBe('a');
  });
});

it('object:', () => {
  const input = { a: 1, b: 2, c: 3 };
  it('should take object as input and convert final sequenz to object', () => {
    const actual = sequenz.object(
      sequenz.map(value => value + 1)
    )(input);
    expect(actual).toEqual({ a: 2, b: 3, c: 4 });
  });
  it('should take string as input and return result if it has been consumed', () => {
    const actual = sequenz.object(sequenz.every(value => value < 4))(input);
    expect(actual).toBe(true);
  });
});
