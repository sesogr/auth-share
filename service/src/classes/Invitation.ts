import { ValueClass } from "./ValueClass.ts";
import { Displayable } from "../interfaceTypes/Displayable.ts";
import { User } from "./User.ts";
export class Invitation<
  ObjType extends Displayable,
  ReceiverType extends Displayable,
> extends ValueClass {
  public get receiverReference(): ReceiverType {
    return this._receiverReference;
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
    private readonly _receiverReference: ReceiverType,
  ) {
    super();
  }
  override toString() {
    return `${this.senderReference.getDisplayName()}:${this.objReference.getDisplayName()}:${this.receiverReference.getDisplayName()}`;
  }
}
