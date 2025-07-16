import { config } from '../index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.time('execution');

config({ path: path.join(__dirname, '.env') });

const msg = process.env.GREETING;
console.log('process.env.GREETING:', msg);

console.timeEnd('execution');

