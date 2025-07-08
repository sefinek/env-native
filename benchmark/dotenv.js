console.time('execution');

import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.HELLO);

console.timeEnd('execution');