# 📄 env-native
Minimalistic, dependency-free `.env` file loader using the native [util.parseEnv](https://nodejs.org/api/util.html#utilparseenvcontent) from Node.js.
Significantly faster and lighter than `dotenv`.


## 🚀 Features
- Zero dependencies
- Fast and lightweight
- Doesn't [promote anything](https://github.com/motdotla/dotenv/issues/876) or spam logs, unlike dotenv
- Uses built-in `util.parseEnv`
- Simple API: `config(options)` or `parse(content, options)`
- Supports custom paths and overrides
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

| Module     | Package Size | Workstation (ms)                  | Thin Client (ms)                       |
|------------|--------------|-----------------------------------|----------------------------------------|
| env-native | 8 KB         | 4.19, 4.77, 4.45, 4.74            | 26.67, 24.97, 25.35, 22.43             |
| dotenv     | 76 KB        | 6.87, 8.04, 7.69, 8.32            | 42.23, 41.22, 46.93, 41.62             |
| dotenvx    | 280 KB       | 71.08, 67.15, 72.06, 70.57        | 211.75, 208.86, 211.20, 208.01         |

`env-native` is fast, clean, and native — with no logs, no overhead, and even up to 10× faster than `dotenvx`.
The `dotenvx` module was created by the same author as `dotenv`.

### Test Environment
#### Workstation
- **CPU:** AMD Ryzen 9 7945HX
- **Disk:** KINGSTON SKC3000S1024G (NVM Express 1.4)
- **OS:** Windows 11 Home

#### Thin Client
- **CPU:** AMD GX-420GI
- **Disk:** WD Red WDS500G1R0B (M.2 SATA)
- **OS:** Ubuntu 24.04.2 LTS (Linux 6.8.0-63-generic)


## 🧪 Example
**.env**
```env
HELLO_WORLD="Keyboard cat memes make your day better! https://youtu.be/J---aiyznGQ"
```

**process.js**
```js
require('env-native').config();
console.log(process.env.HELLO_WORLD); // Keyboard cat memes make your day better! https://youtu.be/J---aiyznGQ
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
Nothing.

#### Example with options
```js
require('env-native').config({ path: './config/.env', override: true });
```

### `parse(content: string, options?)`
Parses raw `.env` file content using the native `util.parseEnv`. Does **not** inject anything into `process.env`.

#### Parameters
| Option    | Type      | Default | Description                                              |
|-----------|-----------|---------|----------------------------------------------------------|
| `coerce`  | `boolean` | `false` | Coerce types: `"false"` → `false`, `"42"` → `42`, etc.   |
| `freeze`  | `boolean` | `true`  | Freeze returned object (immutable)                       |

#### Returns
```ts
Record<string, string | number | boolean>
```

#### Example
```js
const { readFileSync } = require('node:fs');
const { parse } = require('env-native');

const raw = readFileSync('./config/.env.dev', 'utf8');
const parsed = parse(raw, { coerce: true });

console.log(parsed);
```


## 🔒 License
Copyright 2025 © by [Sefinek](https://sefinek.net). All rights reserved.