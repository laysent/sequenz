import reduce from './reduce';
export default predicate => subscribe => reduce((result, element, key) => {
  if (predicate(element, key)) result[0].push(element);
  else result[1].push(element);
  return result;
}, [[], []])(subscribe);
