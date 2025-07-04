console.time('execution');

require('dotenv').config();
console.log(process.env.HELLO);

console.timeEnd('execution');
