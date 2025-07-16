console.time('execution');

import { config } from '../index.js';
config({ path: './example/.env' });

const msg = process.env.GREETING;
console.log('process.env.GREETING:', msg);

console.timeEnd('execution');
