import { ValueClass } from "./ValueClass.ts";

export class ServiceCredential extends ValueClass<ServiceCredential> {
  constructor(
    readonly username?: string,
    readonly password?: string,
  ) {
    super();
  }
  static fromString(string: string) {
    const [username, password] = string.split(":");
    return new ServiceCredential(username, password);
  }
}

//Deno.test("With from valueClass", () => {
//  console.log(new ServiceCredential("d", "e").with({ "username": "u" }));
//});
