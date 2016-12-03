import sortedUniqBy from './sortedUniqBy';
import { identity } from './utils';

/**
 * Creates a duplicated free `sequenz`.
 *
 * **[NOTICE]**: This transformer assumes the `sequenz` is sorted already.
 */
const sortedUniq = () => sortedUniqBy(identity);
export default sortedUniq;
