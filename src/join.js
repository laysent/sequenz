import toList from './toList';

export default (separator = ',') => subscribe => toList(subscribe).join(separator);
