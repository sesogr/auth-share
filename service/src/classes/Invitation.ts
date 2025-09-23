import { ValueClass } from "./ValueClass.ts";
import { Displayable } from "../interfaceTypes/Displayable.ts";
import { Entity } from "../interfaceTypes/Entity.ts";
type DisplayableEntity = Displayable & Entity;

export class Invitation<
  ObjType extends DisplayableEntity,
  ReceiverType extends DisplayableEntity,
> extends ValueClass {
  public get receiverReference(): ReceiverType {
    return this._receiverReference;
  }
  public get objReference(): ObjType {
    return this._objReference;
  }
  public get senderReference(): DisplayableEntity {
    return this._senderReference;
  }
  constructor(
    private readonly _senderReference: DisplayableEntity,
    private readonly _objReference: ObjType,
    private readonly _receiverReference: ReceiverType,
  ) {
    super();
  }
  override toString() {
    return `${this.senderReference.getDisplayName()}:${this.objReference.getDisplayName()}:${this.receiverReference.getDisplayName()}`;
  }
}
