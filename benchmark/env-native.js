console.time('execution');

require('../index.js').config();
console.log(process.env.HELLO);

console.timeEnd('execution');
