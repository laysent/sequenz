import Map from './_map';
/* istanbul ignore next */ function SetPolyfill() {
  this.map = new Map();
}

SetPolyfill.prototype.add /* istanbul ignore next */ = function add(key) {
  this.map.set(key, key);
};

SetPolyfill.prototype.has /* istanbul ignore next */ = function has(key) {
  return this.map.has(key);
};

export default /* istanbul ignore next */ typeof Set === 'undefined' ? SetPolyfill : Set;
