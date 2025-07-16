import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '../index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ENV_PATH = path.resolve(__dirname, '.env');
const content = fs.readFileSync(ENV_PATH, 'utf8');
const parsed = parse(content, { coerce: true });

console.log('🧪 Parsed (typed values):');
for (const [key, value] of Object.entries(parsed)) {
	console.log(`- ${key}:`, value, `(${typeof value})`);
}