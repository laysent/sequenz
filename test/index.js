// require all test files
const testsContext = require.context('.', true, /-test\.js$/);
testsContext.keys().forEach(testsContext);
