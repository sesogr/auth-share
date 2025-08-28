import { ValueClass } from "./ValueClass.ts";
import { Displayable } from "../interfaces/Displayable.ts";
import { User } from "./User.ts";
export class Invitation<
  ObjType extends Displayable,
  ReceiverType extends Displayable
> extends ValueClass {
  public get receiverRefence(): ReceiverType {
    return this._receiverRefence;
  }
  public get objReference(): ObjType {
    return this._objReference;
  }
  public get senderReference(): User {
    return this._senderReference;
  }
  constructor(
    private readonly _senderReference: User,
    private readonly _objReference: ObjType,
    private readonly _receiverRefence: ReceiverType
  ) {
    super();
  }
  override toString() {
    return `${this.senderReference.getDisplayName()}:${this.objReference.getDisplayName()}:${this.receiverRefence.getDisplayName()}`;
  }
  override equals(that: Invitation<ObjType, ReceiverType>) {
    return this.toString() === that.toString();
  }
}
