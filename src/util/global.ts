/**
 * Utility module providing initialized global variables.
 * @module src/util/global
 */
import KnexClient from "./KnexClient";
import env from "./env";

// Knex does not support migration tables in a schema
const KNEX_PRIMARY_TABLE_NAME = "migrations";
const KNEX_PRIMARY_DIRECTORY = `${__dirname}/../knex/primary/migrations`;
const KNEX_PRIMARY_SEEDS_DIRECTORY = `${__dirname}/../knex/primary/seeds`;

/** Application's Knex client */
export const knexClient = new KnexClient(
  env.DATABASE_URL,
  {
    tableName: KNEX_PRIMARY_TABLE_NAME,
    directory: KNEX_PRIMARY_DIRECTORY,
  },
  {
    directory: KNEX_PRIMARY_SEEDS_DIRECTORY,
  }
);

/** Server initialization. */
export const initialize = async (): Promise<void> => {
  // knexClient
  await knexClient.connect();
  knexClient.on("error", (err) => {
    console.log(err);
    process.exit(1);
  });
};
