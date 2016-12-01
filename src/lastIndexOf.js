import findLastIndex from './findLastIndex';
export default (value, fromIndex = 0) => findLastIndex(element => element === value, fromIndex);
