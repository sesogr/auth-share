import { Database } from "../../ports/Database.ts";
import {
  Client,
  ClientConfig,
  Connection,
} from "https://deno.land/x/mysql@v2.12.1/mod.ts";
export default class DBManager implements Database {
  private credentials!: ClientConfig;
  private static requireEnv(key: string): string {
    const value = Deno.env.get(key);
    if (!value) throw new Error(`Missing environment variable: ${key}`);
    return value;
  }
  DBManager() {
    this.credentials = {
      hostname: DBManager.requireEnv("DB_HOST"),
      username: DBManager.requireEnv("DB_USER"),
      db: DBManager.requireEnv("DB_NAME"),
      password: DBManager.requireEnv("DB_PASSWORD"),
    };
  }
}
