'use strict';

const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 20 || (major === 20 && minor < 12)) {
	throw new Error('env-native requires Node.js 20.12.0 or newer');
}

const { existsSync, readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { parseEnv } = require('node:util');
const { version } = require('./package.json');

const coerceValue = v => {
	if (!v.trim()) return v;
	if (v === 'true') return true;
	if (v === 'false') return false;
	const num = Number(v);
	return Number.isNaN(num) ? v : num;
};

const parse = (content, { coerce = false, freeze = true } = {}) => {
	const raw = parseEnv(content);
	const parsed = {};

	for (const [k, v] of Object.entries(raw)) {
		parsed[k] = coerce ? coerceValue(v) : v;
	}

	return freeze ? Object.freeze(parsed) : parsed;
};

const config = ({ path: envPath = '.env', encoding = 'utf8', override = false, coerce = false, freeze = true } = {}) => {
	const resolved = resolve(process.cwd(), envPath);
	if (!existsSync(resolved)) throw new Error(`File not found: ${resolved}`);

	const content = readFileSync(resolved, encoding);
	const parsed = parse(content, { coerce, freeze });

	const injected = {};
	for (const [k, v] of Object.entries(parsed)) {
		if (override || !(k in process.env)) {
			process.env[k] = String(v);
			injected[k] = v;
		}
	}

	return { parsed, injected };
};

module.exports = { config, parse, version };