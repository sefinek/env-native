/**
 * `env-native` module — a minimal `.env` file loader using built-in `util.parseEnv`.
 * Zero dependencies, supports overriding, freezing, and automatic type coercion.
 */

/**
 * Module version (read from package.json)
 */
export const version: string;

/**
 * Options for `config` and `parse` functions
 */
export interface Options {
    /**
     * Type coercion: "true" → true, "42" → 42, etc.
     * @default false
     */
    coerce?: boolean;
    /**
     * Freezes the result (Object.freeze)
     * @default true
     */
    freeze?: boolean;
}

/**
 * Additional options for `config` only
 */
export interface ConfigOptions extends Options {
    /**
     * Path to the .env file
     * @default ".env"
     */
    path?: string;
    /**
     * File encoding
     * @default "utf8"
     */
    encoding?: BufferEncoding;
    /**
     * Override existing environment variables
     * @default false
     */
    override?: boolean;
}

/**
 * Result of `config` execution
 */
export interface ConfigResult {
    /** All parsed variables */
    parsed: Record<string, string | number | boolean>;
    /** Only variables actually injected into process.env */
    injected: Record<string, string | number | boolean>;
}

/**
 * Parses `.env` content without modifying process.env
 * @param content The .env file content as a string
 * @param options Parsing options
 * @returns Object with processed variables
 */
export function parse(
    content: string,
    options?: Options
): Record<string, string | number | boolean>;

/**
 * Loads a `.env` file and injects variables into `process.env`
 * @param options Optional configuration settings
 * @returns Object with all and injected variables
 */
export function config(options?: ConfigOptions): ConfigResult;
