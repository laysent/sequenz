export default (subscribe) => {
  let ret = '';
  subscribe((char) => { ret += char; });
  return ret;
};
