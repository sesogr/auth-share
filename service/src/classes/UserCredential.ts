import { ValueClass } from "./ValueClass.ts";

export class UserCredential extends ValueClass {
  public get password(): string {
    return this._password;
  }
  public get username(): string {
    return this._username;
  }
  constructor(
    private readonly _username: string,
    private readonly _password: string
  ) {
    super();
  }
  override toString() {
    return `${this.username}:${this.password}`;
  }
  override equals(that: UserCredential) {
    return this.toString() === that.toString();
  }
}
