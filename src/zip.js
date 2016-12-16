import compose from './compose';
import toList from './toList';
import fromIterable from './fromIterable';

/**
 * Create a new sequenz containing lists, where nth list in new sequenz containing all nth values
 * in each element from previous sequenz. The `length` will be decided using the `length` of first
 * element in previous sequenz. It will be considered as a single element list, if element is not
 * an array.
 * @param {function(number):function} transformGen - Function that will generate transformer using
 * given `index`. If not provided, no transform will be applied to each internal sequenz.
 */
const zip = (transformGen) => subscribe => onNext => {
  const result = [];
  let pipeline;
  let count = 0;
  subscribe((element, i) => {
    const list = [].concat(element);
    if (!pipeline) {
      if (list.length === 0) return false;
      pipeline = list.map((ele, index) => (function (internalSubscribe) {
        let cache;
        result[index] = internalSubscribe(internalOnNext => { cache = internalOnNext; });
        return (value, key, pipelineIndex) => {
          if (cache(value, key) === false) {
            pipeline[pipelineIndex] = null;
            count -= 1;
          }
        };
      }(transformGen ? compose(transformGen(index), toList) : toList)));
      count = pipeline.length;
    }
    pipeline.forEach((f, index) => {
      if (!f) return;
      f(list[index], i, index);
    });
    return count !== 0;
  });
  return fromIterable(result)(onNext);
};
export default zip;
