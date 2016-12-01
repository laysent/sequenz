import indexOf from './indexOf';
export default (value, fromIndex = 0) => subscribe => indexOf(value, fromIndex)(subscribe) >= 0;
