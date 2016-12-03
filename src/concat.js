import from from './from';

/**
 * @param {...any} sequenzs - A list of elements, each will be iterated over and append to
 * original `sequenz`. If the given element is a function, it will be considered as a `sequenz`;
 * otherwise it will be converted to `sequenz` using `sequenz.from` method.
 */
const concat = (...sequenzs) => subscribe => (onNext) => {
  const subscriptions = [subscribe].concat(
    sequenzs.map(seq => (typeof seq === 'function' ? seq : from(seq))));
  let count = -1;
  const subscriber = element => { count += 1; return onNext(element, count); };
  for (let i = 0; i < subscriptions.length; i += 1) {
    if (subscriptions[i](subscriber) === false) return false;
  }
  return true;
};

export default concat;
