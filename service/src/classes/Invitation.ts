import { ValueClass } from "./ValueClass.ts";
import { Displayable } from "../interfaces/Displayable.ts";
import { User } from "./User.ts";
export class Invitation<
  ObjType extends Displayable,
  ReceiverType extends Displayable
> extends ValueClass {
  constructor(
    private readonly senderReference: User,
    private readonly objReference: ObjType,
    private readonly receiverRefence: ReceiverType
  ) {
    super();
  }
  override toString() {
    return `${this.senderReference.getDisplayName()}:${this.objReference.getDisplayName()}:${this.receiverRefence.getDisplayName()}`;
  }
  override equals(that: Invitation<ObjType, ReceiverType>) {
    return this.toString() === that.toString();
  }
  getObjReference(): ObjType {
    return this.objReference;
  }
  getSenderReference(): User {
    return this.senderReference;
  }
  getReceiverReference(): ReceiverType {
    return this.receiverRefence;
  }
}
