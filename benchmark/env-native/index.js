console.time('execution');

import { config } from '../../index.js';
config();

console.log(process.env.HELLO);

console.timeEnd('execution');