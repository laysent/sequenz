export default defaultValue => subscribe => {
  let ret = defaultValue;
  subscribe(element => { ret = element; return false; });
  return ret;
};
