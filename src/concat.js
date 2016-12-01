import from from './from';

export default (...sequenzs) => subscribe => (onNext) => {
  const subscriptions = [subscribe].concat(
    sequenzs.map(seq => (typeof seq === 'function' ? seq : from(seq))));
  let count = -1;
  const subscriber = element => { count += 1; return onNext(element, count); };
  for (let i = 0; i < subscriptions.length; i += 1) {
    if (subscriptions[i](subscriber) === false) return false;
  }
  return true;
};
