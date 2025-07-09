console.time('execution');

const dotenv = require('dotenv');
dotenv.config();

console.log(process.env.HELLO);

console.timeEnd('execution');