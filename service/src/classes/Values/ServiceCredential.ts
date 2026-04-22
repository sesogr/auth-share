import { ValueClass } from "../ValueClass.ts";

export class ServiceCredential extends ValueClass<ServiceCredential> {
  constructor(
    readonly username?: string,
    readonly password?: string,
  ) {
    super();
    Object.freeze(this);
  }
  static fromString(string: `${string}:${string}`) {
    const [username, password] = string.split(":");
    return new ServiceCredential(username, password);
  }
  override toString() {
    return super.toString() as `${string}:${string}`;
  }
}
