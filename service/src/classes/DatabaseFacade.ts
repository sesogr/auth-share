import { Repository } from "../../ports/Repository.ts";
import {
  Client,
  ClientConfig,
  Connection,
} from "https://deno.land/x/mysql@v2.12.1/mod.ts";
export default class DatabaseFacade implements Repository {
  private credentials: ClientConfig;
  private static requireEnv(key: string): string {
    const value = Deno.env.get(key);
    if (!value) throw new Error(`Missing environment variable: ${key}`);
    return value;
  }
  constructor() {
    this.credentials = {
      hostname: DatabaseFacade.requireEnv("DB_HOST"),
      username: DatabaseFacade.requireEnv("DB_USER"),
      db: DatabaseFacade.requireEnv("DB_NAME"),
      password: DatabaseFacade.requireEnv("DB_PASSWORD"),
    };
  }
}
