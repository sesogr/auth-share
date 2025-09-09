import { ValueClass } from "./ValueClass.ts";

export class ServiceCredential extends ValueClass {
  constructor(
    private readonly username?: string,
    private readonly password?: string,
  ) {
    super();
  }

  override toString() {
    return `${this.username}:${this.password}`;
  }
}
