export default (subscribe) => {
  const ret = { };
  subscribe((element, key) => { ret[key] = element; });
  return ret;
};
