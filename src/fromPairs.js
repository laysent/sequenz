export default () => subscribe => {
  const result = { };
  subscribe(([key, value]) => { result[key] = value; });
  return result;
};
