/**
 * Creates a duplicated free `sequenz`.
 *
 * **[NOTICE]**: This transformer assumes the `sequenz` is sorted already.
 *
 * @param {function(any,any):any} iteratee - Function to convert element before comparasion.
 */
const sortedUniqBy = (iteratee) => subscribe => onNext => {
  let previous;
  let count = -1;
  return subscribe((element, key) => {
    const item = iteratee(element, key);
    if (count >= 0 && previous === item) return true;
    count += 1;
    previous = item;
    return onNext(element, count);
  });
};
export default sortedUniqBy;
