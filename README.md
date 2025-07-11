# 📄 env-native
Minimalistic, zero-dependency `.env` loader powered by Node.js's native [util.parseEnv](https://nodejs.org/api/util.html#utilparseenvcontent).
Significantly faster and smaller than `dotenv` and `dotenvx`.
Designed for performance-critical, production-grade use cases in demanding environments.

<p align="center">
  <a href="https://www.npmjs.com/package/env-native"><img src="https://img.shields.io/npm/v/env-native?color=blue&label=npm" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/env-native"><img src="https://img.shields.io/npm/dm/env-native?label=downloads" alt="npm downloads"></a>
  <a href="https://packagephobia.com/result?p=env-native"><img src="https://packagephobia.com/badge?p=env-native" alt="Install size"></a>
  <a href="https://github.com/sefinek/env-native/actions/workflows/node.js.yml"><img src="https://img.shields.io/github/actions/workflow/status/sefinek/env-native/node.js.yml?branch=main" alt="Build status"></a>
  <a href="https://nodejs.org/en"><img src="https://img.shields.io/node/v/env-native" alt="Node.js version"></a>
  <a href="https://github.com/sefinek/env-native/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/env-native?color=brightgreen" alt="License MIT"></a>
</p>


## 🚀 Features
- Zero dependencies
- Fast and lightweight
- Just 9 KB in size
- Uses built-in `util.parseEnv`
- Simple API: `config(options)` or `parse(content, options)`
- Supports custom file paths and variable overrides
- Supports both ESM and CJS
- No [self-promotion](https://github.com/motdotla/dotenv/issues/876) or console spam, unlike dotenv
- Requires Node.js ≥ **20.12.0**


## 📦 Installation

### npm
```bash
npm install env-native
```

### yarn
```bash
yarn add env-native
```

> Make sure you're using Node.js version `20.12.0` or newer.


## 🧪 Benchmark (Node.js v22.17.0)

| Module           | Package Size | Workstation (ms)              | Thin Client (ms)                   |
|------------------|--------------|-------------------------------|------------------------------------|
| env-native (ESM) | ~ 9 KB       | 0.793, 0.789, 0.782, 0.766    | 2.552, 2.971, 2.743, 2.516         |
| dotenv (CJS)     | ~ 79 KB      | 7.712, 8.067, 8.1, 8.613      | 37.409, 40.966, 37.919, 35.935     |
| dotenvx (CJS)    | ~ 293 KB     | 71.363, 71.766, 70.93, 70.828 | 252.899, 248.658, 249.393, 269.038 |

`env-native` is fast, clean, and native — with no logs, no overhead, and up to **90× faster** than `dotenvx` on weaker systems.
`dotenvx` is maintained by the same author as `dotenv`.

### Test Environment
#### Workstation
- **CPU:** AMD Ryzen 9 7945HX
- **Disk:** KINGSTON SKC3000S1024G (NVM Express 1.4)
- **OS:** Windows 11 Home 24H2

#### Thin Client
- **CPU:** AMD GX-420GI
- **Disk:** WD Red WDS500G1R0B (M.2 SATA)
- **OS:** Ubuntu 24.04.2 LTS (Linux 6.8.0-63-generic)


## 🧪 Example
**.env**
```env
HELLO_WORLD="Keyboard cat! https://youtu.be/J---aiyznGQ"
```

**process.js**
```js
require('env-native').config();
console.log(process.env.HELLO_WORLD); // Keyboard cat! https://youtu.be/J---aiyznGQ
```


## 🧩 API
### `config(options?)`
Loads a `.env` file and injects its variables into `process.env`.

#### Parameters
| Option     | Type      | Default | Description                                 |
|------------|-----------|---------|---------------------------------------------|
| `path`     | `string`  | `.env`  | Path to your `.env` file                    |
| `encoding` | `string`  | `utf8`  | File encoding                               |
| `override` | `boolean` | `false` | Overwrite existing `process.env` variables  |

> **Note:** All injected variables are always stored as strings in `process.env`.

#### Returns
`void`

#### Example with options
```js
require('env-native').config({ path: './config/.env', override: true });
```

### `parse(content: string, options?)`
Parses raw `.env` file content using the native `util.parseEnv`. Does **not** inject anything into `process.env`.

#### Parameters
| Option   | Type      | Default | Description                                                             |
|----------|-----------|---------|-------------------------------------------------------------------------|
| `coerce` | `boolean` | `true`  | Automatically converts values: `"false"` → `false`, `"42"` → `42`, etc. |
| `freeze` | `boolean` | `true`  | Freeze returned object (immutable)                                      |

#### Returns
```ts
Record<string, string | number | boolean>
```

#### Example
```js
const { readFileSync } = require('node:fs');
const { parse } = require('env-native');

const raw = readFileSync('./config/.my-env-file', 'utf8');
const parsed = parse(raw, { coerce: true, freeze: true });

console.log(parsed);
```


## 🔒 License
Copyright 2025 © by [Sefinek](https://sefinek.net). All rights reserved.