import where from './where';
import first from './first';
import compose from './compose';

/**
 * Find the first value in sequenz where it matches the given `properties`. Internally, this API
 * uses `where` to look for matched value.
 *
 * @param {object} properties - Key-pair values that should be used for searching.
 */
const findWhere = (properties) => compose(
  where(properties),
  first()
);
export default findWhere;
