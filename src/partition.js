import groupBy from './groupBy';

const partition = predicate => groupBy((element, i) => predicate(element, i) ? 'truthy' : 'falsey');
export default partition;
