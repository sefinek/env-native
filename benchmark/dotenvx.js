console.time('execution');

require('@dotenvx/dotenvx').config();
console.log(process.env.HELLO);

console.timeEnd('execution');
