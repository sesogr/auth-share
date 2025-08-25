import { ValueClass } from "./ValueClass.ts";
import { Displayable } from "../interfaces/Displayable.ts";
import { User } from "./User.ts";
export class Invitation<
  T extends Displayable,
  U extends Displayable
> extends ValueClass {
  constructor(
    private readonly senderReference: User,
    private readonly objReference: T,
    private readonly receiverRefence: U
  ) {
    super();
  }
  toString() {
    return `${this.senderReference.getDisplayName()}:${this.objReference.getDisplayName()}:${this.receiverRefence.getDisplayName()}`;
  }
  equals(that: Invitation<T, U>) {
    return this.toString() === that.toString();
  }
  getObjReference(): T {
    return this.objReference;
  }
  getSenderReference(): User {
    return this.senderReference;
  }
  getReceiverReference(): U {
    return this.receiverRefence;
  }
}
