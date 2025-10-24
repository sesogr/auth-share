import { DuplicateError } from "../errors/DuplicateError.ts";
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
    private readonly _password: string,
  ) {
    super();
  }
  override toString() {
    return `${this.username}:${this.password}`;
  }
  override with(
    newStuff: { username?: string; password?: string },
  ): UserCredential {
    const newName = newStuff.username ?? this.username;
    const newPassword = newStuff.password ?? this.password;
    const newCred = new UserCredential(newName, newPassword);
    if (newCred.equals(this)) {
      throw new DuplicateError(newCred.toString() + " is the same");
    }
    return newCred;
  }
  override copy(): UserCredential {
    return new UserCredential(this.username, this.password);
  }
}
