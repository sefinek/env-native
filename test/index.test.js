import { test, expect, afterEach } from '@jest/globals';
import { writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from '../index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMP_ENV_PATH = resolve(__dirname, '.env.test');
const rand = len => randomBytes(len).toString('hex');
const randomVars = n => Array.from({ length: n }, () => `KEY_${rand(4).toUpperCase()}=${rand(8)}`).join('\n');

afterEach(() => {
	for (const k of Object.keys(process.env)) {
		if (k.startsWith('KEY_') || k.startsWith('UNSET_') || ['TEST_KEY', 'SPACE_KEY', 'QUOTE', 'UNICODE', 'ESCAPE', 'RANDOM_VAR'].includes(k)) delete process.env[k];
	}
	if (existsSync(TEMP_ENV_PATH)) unlinkSync(TEMP_ENV_PATH);
});

test('injects multiple random variables', () => {
	const env = randomVars(32);
	writeFileSync(TEMP_ENV_PATH, env);

	loadEnv({ path: TEMP_ENV_PATH });

	for (const line of env.split('\n')) {
		const [k, v] = line.split('=');
		expect(process.env[k]).toBe(v);
	}
});

test('parses values with spaces, quotes, unicode, escapes, random', () => {
	const val = rand(12);
	writeFileSync(TEMP_ENV_PATH, [
		'SPACE_KEY="hello world"',
		'QUOTE=\'quoted\'',
		'UNICODE=✓',
		'ESCAPE="line\\nbreak"',
		`RANDOM_VAR="${val}"`,
	].join('\n'));

	loadEnv({ path: TEMP_ENV_PATH });

	expect(process.env.SPACE_KEY).toBe('hello world');
	expect(process.env.QUOTE).toBe('quoted');
	expect(process.env.UNICODE).toBe('✓');
	expect(process.env.ESCAPE).toBe('line\nbreak');
	expect(process.env.RANDOM_VAR).toBe(val);
});

test('ignores commented and empty lines', () => {
	const key = 'KEY_' + rand(4).toUpperCase();
	writeFileSync(TEMP_ENV_PATH, `\n# Comment\n${key}=val\n\n#X\n`);

	loadEnv({ path: TEMP_ENV_PATH });

	expect(process.env[key]).toBe('val');
});

test('uses custom encoding', () => {
	const v = '✓' + rand(4);
	writeFileSync(TEMP_ENV_PATH, Buffer.from(`TEST_KEY=${v}`, 'utf8'));

	loadEnv({ path: TEMP_ENV_PATH, encoding: 'utf8' });

	expect(process.env.TEST_KEY).toBe(v);
});

test('does not override existing vars by default', () => {
	process.env.TEST_KEY = 'ex_' + rand(2);
	const unsetKey = 'UNSET_' + rand(3).toUpperCase();
	writeFileSync(TEMP_ENV_PATH, `TEST_KEY=override\n${unsetKey}=set`);

	loadEnv({ path: TEMP_ENV_PATH });

	expect(process.env.TEST_KEY.startsWith('ex_')).toBe(true);
	expect(process.env[unsetKey]).toBe('set');
});

test('overrides only selected when override is enabled', () => {
	process.env.TEST_KEY = 'a' + rand(1);
	const unsetKey = 'UNSET_' + rand(3).toUpperCase();
	process.env[unsetKey] = 'b' + rand(1);
	writeFileSync(TEMP_ENV_PATH, `TEST_KEY=x\n${unsetKey}=y`);

	loadEnv({ path: TEMP_ENV_PATH, override: true });

	expect(process.env.TEST_KEY).toBe('x');
	expect(process.env[unsetKey]).toBe('y');
});

test('works with absolute path and random value', () => {
	const key = 'KEY_' + rand(6).toUpperCase();
	const value = rand(10);
	writeFileSync(TEMP_ENV_PATH, `${key}=${value}`);

	loadEnv({ path: TEMP_ENV_PATH });

	expect(process.env[key]).toBe(value);
});