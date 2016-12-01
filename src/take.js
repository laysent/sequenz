import takeWhile from './takeWhile';

export default (num = 1) => takeWhile((_, idx) => idx < num);
