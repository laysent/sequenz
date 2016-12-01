import findOrigin from './_find';

export default (predicate, fromIndex) => subscribe =>
  findOrigin(predicate, fromIndex)(subscribe).value;
