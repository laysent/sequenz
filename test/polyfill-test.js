import Map from '../src/_map';
import Set from '../src/_set';

describe('Polyfill Map:', () => {
  it('should store same key only once', () => {
    const list = [
      1, 1, '1', '1', 0, 0, '0', '0',
      NaN, NaN, undefined, undefined, null, null,
      {}, {}, [], [], /a/, /a/,
    ];
    const map = new Map();
    list.forEach((num, i) => { map.set(num, i); });
    expect(map.get(1)).toBe(1);
    expect(map.get('1')).toBe(3);
    expect(map.get(0)).toBe(5);
    expect(map.get('0')).toBe(7);
    expect(map.get(NaN)).toBe(9);
    expect(map.get(undefined)).toBe(11);
    expect(map.get(null)).toBe(13);
    expect(map.get({})).toBeUndefined();
    expect(map.get([])).toBeUndefined();
    expect(map.get(/a/)).toBeUndefined();
    for (let i = 14; i < list.length; i += 1) {
      expect(map.get(list[i])).toBe(i);
    }
  });
});

describe('Polyfill Set:', () => {
  it('should store same key only once', () => {
    const duplicate = [
      1, 1, '1', '1', 0, 0, '0', '0',
      NaN, NaN, undefined, undefined, null, null,
    ];
    const uniq = [
      {}, {}, [], [], /a/, /a/,
    ];
    const set = new Set();
    for (let i = 0; i < duplicate.length; i += 1) {
      if (i % 2 === 0) {
        set.add(duplicate[i]);
      } else {
        expect(set.has(duplicate[i])).toBe(true);
      }
    }
    for (let i = 0; i < uniq.length; i += 1) {
      expect(set.has(uniq[i])).toBe(false);
      set.add(uniq[i]);
    }
  });
});
