export default (iteratee, initial) => {
  if (arguments.length === 1) {
    return (subscribe) => {
      let result;
      let hasInitial = false;
      subscribe((element) => {
        if (!hasInitial) {
          hasInitial = true;
          result = element;
        } else {
          result = iteratee(result, element);
        }
      });
      return result;
    };
  }
  return (subscribe) => {
    let result = initial;
    subscribe((element, key) => {
      result = iteratee(result, element, key);
    });
    return result;
  };
};
