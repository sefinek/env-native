import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseEnv } from 'node:util';
import pkg from './package.json' with { type: 'json' };

const coerceValue = v => {
	if (!v.trim()) return v;
	if (v === 'true') return true;
	if (v === 'false') return false;
	const n = Number(v);
	return !Number.isNaN(n) && String(n) === v ? n : v;
};

export const parse = (content, { coerce = true, freeze = true } = {}) => {
	const raw = parseEnv(content);
	const parsed = {};

	for (const [k, v] of Object.entries(raw)) {
		parsed[k] = coerce ? coerceValue(v) : v;
	}

	return freeze ? Object.freeze(parsed) : parsed;
};

export const config = ({ path = '.env', encoding = 'utf8', override = false } = {}) => {
	const cwd = process.cwd();

	for (const p of Array.isArray(path) ? path : [path]) {
		let content;
		try {
			content = readFileSync(resolve(cwd, p), encoding);
		} catch (err) {
			throw new Error(err.message);
		}

		const parsed = parse(content, { coerce: false, freeze: false });
		for (const [k, v] of Object.entries(parsed)) {
			if (override || !(k in process.env)) process.env[k] = String(v);
		}
	}
};

export const version = pkg.version;
