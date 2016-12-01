export default (...transforms) => input => transforms.reduce((prev, curr) => curr(prev), input);
