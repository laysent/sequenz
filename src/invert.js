export default () => subscribe => onNext => subscribe((element, key) => onNext(key, element));
