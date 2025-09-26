import { ValueClass } from "./ValueClass.ts";
import { DisplayableEntity } from "../interfaceTypes/DisplayableEntity.ts";

export class Invitation extends ValueClass {
  public get receiverReference(): DisplayableEntity {
    return this._receiverReference;
  }
  public get objReference(): DisplayableEntity {
    return this._objReference;
  }
  public get senderReference(): DisplayableEntity {
    return this._senderReference;
  }
  constructor(
    private readonly _senderReference: DisplayableEntity,
    private readonly _objReference: DisplayableEntity,
    private readonly _receiverReference: DisplayableEntity,
  ) {
    super();
  }
  override toString() {
    return `${this.senderReference.getDisplayName()}:${this.objReference.getDisplayName()}:${this.receiverReference.getDisplayName()}`;
  }
}
