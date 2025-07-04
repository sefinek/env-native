# env-native
Minimalistic, dependency-free `.env` file loader using the native [util.parseEnv](https://nodejs.org/api/util.html#utilparseenvcontent) from Node.js.


## 🚀 Features
- Zero dependencies
- Fast and lightweight
- Doesn't [promote anything](https://github.com/motdotla/dotenv/issues/876) or spam logs, unlike dotenv
- Uses built-in `node:util.parseEnv`
- Simple API: `config(options)` or `parse(content, options)`
- Supports custom paths and overrides
- Requires Node.js ≥ **20.12.0**


## 🧪 Benchmark (Node.js v22.17.0)
### ⚙️ Workstation
- **CPU:** AMD Ryzen 9 7945HX
- **Disk:** KINGSTON SKC3000S1024G (NVM Express 1.4)
- **OS:** Windows 11 Home

| Module     | Execution Time                     |
|------------|------------------------------------|
| env-native | 4.19ms, 4.77ms, 4.45ms, 4.74ms     |
| dotenv     | 6.87ms, 8.04ms, 7.69ms, 8.32ms     |
| dotenvx    | 71.08ms, 67.15ms, 72.06ms, 70.57ms |

### 🧱 Thin Client
- **CPU:** AMD GX-420GI
- **Disk:** WD Red WDS500G1R0B (M.2 SATA)
- **OS:** Ubuntu 24.04.2 LTS (Linux 6.8.0-63-generic)

| Module     | Execution Time                         |
|------------|----------------------------------------|
| env-native | 26.67ms, 24.97ms, 25.35ms, 22.43ms     |
| dotenv     | 42.23ms, 41.22ms, 46.93ms, 41.62ms     |
| dotenvx    | 211.75ms, 208.86ms, 211.20ms, 208.01ms |


## 📦 Installation
```bash
npm install env-native
```

> Make sure you're using Node.js version `20.12.0` or newer.


## 🧪 Example
**.env**
```env
HELLO_WORLD="keyboard cat https://www.youtube.com/watch?v=J---aiyznGQ"
```

**process.js**
```js
require('env-native').config();

console.log(process.env.HELLO_WORLD); // "keyboard cat https://www.youtube.com/watch?v=J---aiyznGQ"
```


## 🧩 API
### `config(options?)`
Loads a `.env` file and injects its variables into `process.env`.

#### Parameters
| Option     | Type      | Default | Description                                             |
|------------|-----------|---------|---------------------------------------------------------|
| `path`     | `string`  | `.env`  | Path to your `.env` file                                |
| `encoding` | `string`  | `utf8`  | File encoding                                           |
| `override` | `boolean` | `false` | Overwrite existing `process.env` variables              |
| `coerce`   | `boolean` | `false` | Coerce values: `"true"` → `true`, `"42"` → `42`, etc.   |
| `freeze`   | `boolean` | `true`  | Freeze `parsed` and `injected` objects (make immutable) |

> **Note:** `process.env` always stores values as strings. Even with `coerce: true`, the injected variables in `process.env` remain stringified. Coercion only affects the returned `parsed` and `injected` objects.

#### Returns
```ts
{
  parsed: Record<string, string>,   // all parsed variables
  injected: Record<string, string>  // only the ones actually injected
}
```

#### Example with options
```js
const { config } = require('env-native');

const result = config({
  path: './config/.env.dev',
  override: true,
  coerce: true
});

console.log(result.injected); // only variables injected into process.env
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