import sortedUniqBy from './sortedUniqBy';
import { identity } from './utils';

export default () => sortedUniqBy(identity);
