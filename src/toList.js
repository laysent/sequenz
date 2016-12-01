export default subscribe => {
  const ret = [];
  subscribe((element) => { ret.push(element); });
  return ret;
};
