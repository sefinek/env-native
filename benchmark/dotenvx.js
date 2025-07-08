console.time('execution');

import { config } from '@dotenvx/dotenvx';
config();

console.log(process.env.HELLO);

console.timeEnd('execution');