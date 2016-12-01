import findLastOrigin from './_findLast';

export default (predicate, fromIndex) => subscribe =>
  findLastOrigin(predicate, fromIndex)(subscribe).value;
