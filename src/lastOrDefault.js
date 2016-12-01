export default (defaultValue) => subscribe => {
  let value = defaultValue;
  subscribe(element => { value = element; });
  return value;
};
