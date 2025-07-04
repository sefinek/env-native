const fs = require('node:fs');
const path = require('node:path');
const { config: loadEnv } = require('../index.js');

const TEMP_ENV_PATH = path.resolve(__dirname, '.env.test');

afterEach(() => {
	for (const key of ['TEST_KEY', 'EXISTING', 'MULTI', 'SPACE_KEY', 'QUOTE', 'UNSET']) {
		delete process.env[key];
	}
	if (fs.existsSync(TEMP_ENV_PATH)) fs.unlinkSync(TEMP_ENV_PATH);
});

test('injects multiple variables', () => {
	fs.writeFileSync(TEMP_ENV_PATH, 'TEST_KEY=1\nMULTI=2');

	const { parsed, injected } = loadEnv({ path: TEMP_ENV_PATH });

	expect(parsed).toEqual({ TEST_KEY: '1', MULTI: '2' });
	expect(injected).toEqual({ TEST_KEY: '1', MULTI: '2' });
	expect(process.env.TEST_KEY).toBe('1');
	expect(process.env.MULTI).toBe('2');
});

test('parses values with spaces and quotes', () => {
	fs.writeFileSync(TEMP_ENV_PATH, 'SPACE_KEY="hello world"\nQUOTE=\'quoted\'');

	const { parsed } = loadEnv({ path: TEMP_ENV_PATH });

	expect(parsed.SPACE_KEY).toBe('hello world');
	expect(parsed.QUOTE).toBe('quoted');
});

test('ignores commented lines and empty lines', () => {
	fs.writeFileSync(TEMP_ENV_PATH, '\n# Comment line\nTEST_KEY=value\n');

	const { parsed } = loadEnv({ path: TEMP_ENV_PATH });

	expect(parsed).toEqual({ TEST_KEY: 'value' });
});

test('uses custom encoding', () => {
	fs.writeFileSync(TEMP_ENV_PATH, Buffer.from('TEST_KEY=✓', 'utf8'));

	const { parsed } = loadEnv({ path: TEMP_ENV_PATH, encoding: 'utf8' });

	expect(parsed.TEST_KEY).toBe('✓');
});

test('returns only injected vars if some already exist', () => {
	process.env.TEST_KEY = 'existing';
	fs.writeFileSync(TEMP_ENV_PATH, 'TEST_KEY=override\nUNSET=defined');

	const { injected } = loadEnv({ path: TEMP_ENV_PATH });

	expect(injected).toEqual({ UNSET: 'defined' });
	expect(process.env.TEST_KEY).toBe('existing');
	expect(process.env.UNSET).toBe('defined');
});

test('overrides only selected when override is enabled', () => {
	process.env.TEST_KEY = 'a';
	process.env.UNSET = 'b';
	fs.writeFileSync(TEMP_ENV_PATH, 'TEST_KEY=x\nUNSET=y');

	const { injected } = loadEnv({ path: TEMP_ENV_PATH, override: true });

	expect(injected).toEqual({ TEST_KEY: 'x', UNSET: 'y' });
	expect(process.env.TEST_KEY).toBe('x');
	expect(process.env.UNSET).toBe('y');
});

test('works with absolute paths', () => {
	fs.writeFileSync(TEMP_ENV_PATH, 'TEST_KEY=absolute');

	const { parsed } = loadEnv({ path: TEMP_ENV_PATH });

	expect(parsed.TEST_KEY).toBe('absolute');
});
