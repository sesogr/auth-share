import { ValueClass } from "./ValueClass.ts";

export class Session extends ValueClass {
  override toString(): string {
    throw new Error("Method not implemented.");
  }
  override with(_: object): ValueClass {
    throw new Error("Method not implemented.");
  }
  override copy(): ValueClass {
    throw new Error("Method not implemented.");
  }
  constructor(
    readonly id: string,
    readonly expiresAt: Date,
    readonly userId: string,
  ) {
    super();
  }
  //DB Table "Sessions"
  //Session Class done
  //DB Session link to?
  //repository user with sessions --> hydration
  //USer Class new Attributes (session[], passwordhash)
  //
}
