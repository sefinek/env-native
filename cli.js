#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { config, parse, version } from './index.js';
import { parseArgs } from 'node:util';

const printUsage = () => {
	process.stdout.write(
		'Usage:\n' +
		'  env-native [--env <file>] [--coerce|--no-coerce] [--freeze|--no-freeze] [--cmd <command> [args...]]\n' +
		'  env-native [--env <file>] [--coerce|--no-coerce] [--freeze|--no-freeze]\n' +
		'\n' +
		'Flags:\n' +
		'  --env, -e      Path to .env file (default: .env)\n' +
		'  --cmd, -c      Command to execute with loaded env\n' +
		'  --coerce       Auto-convert numbers and booleans (default: true)\n' +
		'  --freeze       Freeze parsed object (default: true)\n' +
		'  --help, -h     Show this help message\n' +
		'  --version, -v  Print version'
	);
};

if (process.argv.length === 2) {
	printUsage();
	process.exit(0);
}

const { values, positionals } = parseArgs({
	options: {
		env: { type: 'string', short: 'e', default: '.env' },
		cmd: { type: 'string', short: 'c' },
		coerce: { type: 'boolean', default: true },
		freeze: { type: 'boolean', default: true },
		help: { type: 'boolean', short: 'h', default: false },
		version: { type: 'boolean', short: 'v', default: false },
	},
	allowPositionals: true,
});

if (values.version) {
	process.stdout.write(`${version}\n`);
	process.exit(0);
}

if (values.help) {
	printUsage();
	process.exit(0);
}

const envPath = resolve(process.cwd(), values.env);
const cmdArr = values.cmd ? [values.cmd, ...positionals] : positionals;

if (!cmdArr.length) {
	try {
		const content = readFileSync(envPath, 'utf8');
		const parsed = parse(content, { coerce: values.coerce, freeze: values.freeze });
		process.stdout.write(JSON.stringify(parsed, null, 2) + '\n');
		process.exit(0);
	} catch (err) {
		process.stderr.write(`Error reading env file: ${err.message}\n`);
		process.exit(1);
	}
}

try {
	config({ path: envPath });
} catch (err) {
	process.stderr.write(`Error loading env file: ${err.message}\n`);
	process.exit(1);
}

const proc = spawn(cmdArr[0], cmdArr.slice(1), {
	stdio: 'inherit',
	env: process.env,
});
proc.on('exit', code => process.exit(code));
proc.on('error', err => {
	process.stderr.write(`Error executing command: ${err.message}\n`);
	process.exit(1);
});

