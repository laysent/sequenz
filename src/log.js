import intercept from './intercept';
/**
 * Logs each intermediate element and it's key
 */
const log = () => intercept((element, key) => { console.log(element, key); });
export default log;
