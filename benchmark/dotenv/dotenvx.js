console.time('execution');

const { config } = require('@dotenvx/dotenvx');
config();

console.log(process.env.HELLO);

console.timeEnd('execution');