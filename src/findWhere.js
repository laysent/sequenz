import where from './where';
import first from './first';
import compose from './compose';

export default (properties) => compose(
  where(properties),
  first()
);
