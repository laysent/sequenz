export default (predicate) => subscribe => {
  let result = false;
  subscribe((element) => {
    if (predicate(element)) result = true;
    return !result;
  });
  return result;
};
