/**
 * convert iterable to sequence. Iterable should contain `length` and should be able to get each
 * element via `[i]`.
 *
 * @param {array|string} input - Iterable. Normally should be either string or array.
 * @return {function} function to receive subscriber
 */
export default input =>
  /**
   * function for subscribe.
   *
   * @param {function} onNext - function to receive each element.
   */
  (onNext) => {
    const length = input.length;
    for (let i = 0; i < length; i += 1) {
      if (onNext(input[i], i) === false) {
        return false;
      }
    }
    return true;
  };
