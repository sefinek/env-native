/**
 * Module version (read from package.json).
 */
export const version: string;

/**
 * Options for `parse` function.
 */
export interface Options {
    /**
     * Type coercion: "true" → true, "42" → 42, etc.
     * @default true
     */
    coerce?: boolean;
    /**
     * Freezes the result (Object.freeze)
     * @default true
     */
    freeze?: boolean;
}

/**
 * Additional options for `config` only.
 */
export interface ConfigOptions extends Options {
    /**
     * Path(s) to the .env file(s). Single path as string or multiple as array of strings.
     * @default ".env"
     */
    path?: string | string[];
    /**
     * File encoding
     * @default "utf8"
     */
    encoding?: BufferEncoding;
    /**
     * Override existing environment variables.
     * @default false
     */
    override?: boolean;
}

/**
 * Parses `.env` content without modifying process.env.
 * @param content The .env file content as a string
 * @param options Parsing options
 * @returns Object with processed variables (string, number, or boolean)
 */
export function parse(
    content: string,
    options?: Options
): Record<string, string | number | boolean>;

/**
 * Loads one or multiple `.env` files and injects variables into `process.env`.
 * @param options Optional configuration settings
 * @returns void
 */
export function config(options?: ConfigOptions): void;
