import { ValueClass } from "./ValueClass.ts";

export class UserCredential extends ValueClass {
  constructor(
    private readonly username: string,
    private readonly password: string
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
