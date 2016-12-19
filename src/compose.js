const compose = (...transforms) => input => {
  let ret = input;
  for (let i = 0; i < transforms.length; i += 1) {
    ret = transforms[i](ret);
  }
  return ret;
};
export default compose;
