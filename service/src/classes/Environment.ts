import { EnvError } from "./errors/EnvError.ts";
import { Logger } from "../../interfaceTypes/Logger.ts";

export class Environment {
  private static logger: Logger;
  private static _FRONT_END_URL: string;
  public static get FRONT_END_URL(): string {
    if (!this.checked) {
      this.check();
    }
    return this._FRONT_END_URL;
  }
  public static set FRONT_END_URL(value: string) {
    this.checked = false;
    this._FRONT_END_URL = value;
  }
  private static _DB_NAME: string;
  public static get DB_NAME(): string {
    if (!this.checked) {
      this.check();
    }
    return this._DB_NAME;
  }
  public static set DB_NAME(value: string) {
    this.checked = false;
    this._DB_NAME = value;
  }
  private static _DB_USER: string;
  public static get DB_USER(): string {
    if (!this.checked) {
      this.check();
    }
    return this._DB_USER;
  }
  public static set DB_USER(value: string) {
    this.checked = false;
    this._DB_USER = value;
  }
  private static _DB_PASSWORD: string;
  public static get DB_PASSWORD(): string {
    if (!this.checked) {
      this.check();
    }
    return this._DB_PASSWORD;
  }
  public static set DB_PASSWORD(value: string) {
    this.checked = false;
    this._DB_PASSWORD = value;
  }
  private static _DENO_ENV: string;
  public static get DENO_ENV(): string {
    if (!this.checked) {
      this.check();
    }
    return this._DENO_ENV;
  }
  public static set DENO_ENV(value: string) {
    this.checked = false;
    this._DENO_ENV = value;
  }
  private static _DB_HOST: string;
  public static get DB_HOST(): string {
    if (!this.checked) {
      this.check();
    }
    return this._DB_HOST;
  }
  public static set DB_HOST(value: string) {
    this.checked = false;
    this._DB_HOST = value;
  }
  private static checked: boolean = false;

  private static check() {
    const undefinedKey = Object.keys(this).find((key) =>
      this[key as keyof Environment] === undefined
    );
    if (undefinedKey) {
      throw new EnvError(`Environment variable ${undefinedKey} is not set`);
    }
    this.checked = true;
  }
  public static clear() {
    this._FRONT_END_URL = undefined as unknown as string;
    this._DB_NAME = undefined as unknown as string;
    this._DB_USER = undefined as unknown as string;
    this._DB_PASSWORD = undefined as unknown as string;
    this._DENO_ENV = undefined as unknown as string;
    this._DB_HOST = undefined as unknown as string;
    this.checked = false;
  }
  public static load(logger: Logger): void {
    this.logger = logger.withOwnContext("Environment");
    this.FRONT_END_URL = Deno.env.get("FRONT_END_URL")!;
    this.DB_NAME = Deno.env.get("DB_NAME")!;
    this.DB_USER = Deno.env.get("DB_USER")!;
    this.DB_PASSWORD = Deno.env.get("DB_PASSWORD")!;
    this.DB_HOST = Deno.env.get("DB_HOST")!;
    this.DENO_ENV = Deno.env.get("DENO_ENV")!;
    this.check();
  }
}
