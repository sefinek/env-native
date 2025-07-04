console.time('execution');

require('../index.js').config();

const msg = process.env.GREETING;
console.log('process.env.GREETING:', msg);

console.timeEnd('execution');
