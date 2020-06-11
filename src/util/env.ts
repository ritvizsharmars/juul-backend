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
const envUnknown = process.env as unknown; // have to first cast to an unknown
const env = envUnknown as Env; // can safely cast due to Avj validation

/** Processed environment */
export default {
  ...env,
};
