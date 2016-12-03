import filter from './filter';
/**
 * Remove all falsey values.
 * In JavaScript, `false`, `null`, `undefined`, `0`, `''` and `NaN` are considered falsey values.
 */
const compact = () => filter(x => !!x);
export default compact;
