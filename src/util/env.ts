/**
 * Utility module for environment variables.
 * @module src/util/env
 */
/* eslint-disable no-console */

interface Env {
  DATABASE_URL: string;
  PORT: string;
  LOCALHOST: string;
}

// casting environment
const envUnknown = process.env as unknown;
const env = envUnknown as Env;

/** Processed environment */
export default {
  ...env,
};
