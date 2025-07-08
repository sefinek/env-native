'use strict';

const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { parseEnv } = require('node:util');
const { version } = require('./package.json');

const coerceValue = v => {
	if (!v.trim()) return v;
	if (v === 'true') return true;
	if (v === 'false') return false;
	const n = +v;
	return String(n) === v ? n : v;
};

const parse = (content, { coerce = false, freeze = true } = {}) => {
	const raw = parseEnv(content);
	const parsed = {};

	for (const k in raw) {
		const v = raw[k];
		parsed[k] = coerce ? coerceValue(v) : v;
	}

	return freeze ? Object.freeze(parsed) : parsed;
};

const config = ({ path = '.env', encoding = 'utf8', override = false } = {}) => {
	const resolved = resolve(process.cwd(), path);

	let content;
	try {
		content = readFileSync(resolved, encoding);
	} catch (err) {
		throw new Error(err.message);
	}

	const parsed = parse(content);
	for (const k in parsed) {
		if (override || !(k in process.env)) process.env[k] = parsed[k];
	}
};

module.exports = { config, parse, version };