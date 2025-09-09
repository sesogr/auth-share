import { ValueClass } from "./ValueClass.ts";

export class ServiceCredential extends ValueClass {
  public get password(): string {
    return this._password ?? "notIncluded";
  }
  public get username(): string {
    return this._username ?? "notIncluded";
  }
  constructor(
    private readonly _username?: string,
    private readonly _password?: string,
  ) {
    super();
  }

  override toString() {
    return `${this.username}:${this.password}`;
  }
}
