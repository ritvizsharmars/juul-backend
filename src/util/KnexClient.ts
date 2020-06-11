/**
 * Utility module providing modern inteface to Knex client.
 * @module src/util/KnexClient
 */
import { EventEmitter } from "events";
import knex, { Config } from "knex";
import pg from "pg";

interface Migrations {
  directory: string;
  tableName: string;
}
interface Seeds {
  directory: string;
}

pg.defaults.ssl = true;

/** Modern interface to Knex client.  */
export default class KnexClient extends EventEmitter {
  private privateConnected = false;

  private url: string | undefined;

  private client: knex<any, unknown[]>;

  private migrations: Migrations | null = null;

  private seeds: Seeds | null = null;

  private handlePoolCreateSuccess = (eventId: any, resource: any): void => {
    resource.on("error", this.handleResourceError);
  };

  private handlePoolDestroyRequest = (eventId: any, resource: any): void => {
    resource.off("error", this.handleResourceError);
  };

  private handleResourceError = (): void => {
    // setImmediate did not allow for knex commands to fail first
    setTimeout(() => {
      this.emit(
        "error",
        new Error(`KnexClient: Pool resource error for: ${this.url}`)
      );
    }, 500);
  };

  constructor(url: string | undefined, migrations?: Migrations, seeds?: Seeds) {
    super();
    this.url = url;
    if (migrations !== undefined) {
      this.migrations = migrations;
    }
    if (seeds !== undefined) {
      this.seeds = seeds;
    }
    let knexConfig: Config = {
      client: "pg",
      connection: this.url,
    };
    if (this.migrations !== null) {
      knexConfig = { ...knexConfig, migrations: this.migrations };
    }
    if (this.seeds !== null) {
      knexConfig = { ...knexConfig, seeds: this.seeds };
    }
    this.client = knex(knexConfig);
  }

  public get connected(): boolean {
    return this.privateConnected;
  }

  public get knex(): knex<any, unknown[]> {
    return this.client;
  }

  public async connect(): Promise<void> {
    if (this.privateConnected) {
      return;
    }
    const { pool } = this.client.client;
    pool.on("createSuccess", this.handlePoolCreateSuccess);
    pool.on("destroyRequest", this.handlePoolDestroyRequest);
    try {
      await this.client.raw("SELECT 1");
    } catch (err) {
      pool.removeListener("createSuccess", this.handlePoolCreateSuccess);
      pool.removeListener("destroyRequest", this.handlePoolDestroyRequest);
      throw new Error(`KnexClient: Failed to connect to: ${this.url} ${err}`);
    }
    this.privateConnected = true;
  }
}
