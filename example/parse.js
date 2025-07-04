const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('../index.js');

const ENV_PATH = path.resolve(__dirname, '.env');
const content = fs.readFileSync(ENV_PATH, 'utf8');

const parsed = parse(content, { coerce: true });

console.log('🧪 Parsed (typed values):');
for (const [key, value] of Object.entries(parsed)) {
	console.log(`- ${key}:`, value, `(${typeof value})`);
}