import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseEnv } from 'node:util';
import pkg from './package.json' with { type: 'json' };

const coerceValue = v => {
	if (!v.trim()) return v;
	if (v === 'true') return true;
	if (v === 'false') return false;
	const n = +v;
	return String(n) === v ? n : v;
};

export const parse = (content, { coerce = false, freeze = true } = {}) => {
	const raw = parseEnv(content);
	const parsed = {};

	for (const k in raw) {
		const v = raw[k];
		parsed[k] = coerce ? coerceValue(v) : v;
	}

	return freeze ? Object.freeze(parsed) : parsed;
};

export const config = ({ path = '.env', encoding = 'utf8', override = false } = {}) => {
	const paths = Array.isArray(path) ? path : [path];

	for (const p of paths) {
		let content;
		try {
			content = readFileSync(resolve(process.cwd(), p), encoding);
		} catch (err) {
			throw new Error(err.message);
		}

		const parsed = parse(content);
		for (const k in parsed) {
			if (override || !(k in process.env)) process.env[k] = String(parsed[k]);
		}
	}
};

export const version = pkg.version;