import takeWhile from './takeWhile';

/**
 * Take given number of elements in sequenz.
 *
 * @param {number} num - Number of elements to take in sequenz.
 */
const take = (num = 1) => takeWhile((_, idx) => idx < num);
export default take;
