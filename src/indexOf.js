import findIndex from './findIndex';
import findLastIndex from './findLastIndex';

export default (value, fromIndex = 0) => (
  fromIndex < 0 ?
  findLastIndex(x => x === value, -1 * fromIndex) :
  findIndex(x => x === value, fromIndex)
);
