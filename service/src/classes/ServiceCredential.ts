import { DuplicateError } from "../errors/DuplicateError.ts";
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
  override with(
    newStuff: { username?: string; password?: string },
  ): ServiceCredential {
    const newName = newStuff.username ?? this.username;
    const newPassword = newStuff.password ?? this.password;
    const newCred = new ServiceCredential(newName, newPassword);
    if (newCred.equals(this)) {
      throw new DuplicateError(newCred.toString() + "is the same");
    }
    return newCred;
  }
  override copy(): ServiceCredential {
    return new ServiceCredential(this.username, this.password);
  }
  static fromString(string: string) {
    const [username, password] = string.split(":");
    return new ServiceCredential(username, password);
  }
}
