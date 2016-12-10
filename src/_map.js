import { isString, isNumber } from './utils';
/* istanbul ignore next */ function MapPolyfill() {
  this.str = {};
  this.num = {};
}

MapPolyfill.prototype.set /* istanbul ignore next */ = function add(key, value) {
  if (isString(key)) {
    this.str[key] = value;
    return;
  } else if (isNumber(key)) {
    this.num[key] = value;
    return;
  }
  if (!this.restKey) { this.restKey = []; this.restValue = []; }
  for (let i = 0; i < this.restKey.length; i += 1) {
    if (this.restKey[i] === key) {
      this.restValue[i] = value;
      return;
    }
  }
  this.restKey.push(key);
  this.restValue.push(value);
};

MapPolyfill.prototype.has /* istanbul ignore next */ = function has(key) {
  if (isString(key)) return this.str.hasOwnProperty(key);
  else if (isNumber(key)) return this.num.hasOwnProperty(key);
  else if (!this.restKey) return false;
  for (let i = 0; i < this.restKey.length; i += 1) {
    if (this.restKey[i] === key) return true;
  }
  return false;
};

MapPolyfill.prototype.get /* istanbul ignore next */ = function get(key) {
  if (isString(key)) return this.str[key];
  else if (isNumber(key)) return this.num[key];
  else if (!this.restKey) return undefined;
  for (let i = 0; i < this.restKey.length; i += 1) {
    if (this.restKey[i] === key) return this.restValue[i];
  }
  return undefined;
};

export default /* istanbul ignore next */ typeof May === 'undefined' ? MapPolyfill : Map;
