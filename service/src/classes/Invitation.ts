import { ValueClass } from "./ValueClass.ts";
import { ShortEntity } from "../interfaceTypes/ShortEntity.ts";

export class Invitation extends ValueClass {
  public get receiverReference(): ShortEntity {
    return this._receiverReference;
  }
  public get objReference(): ShortEntity {
    return this._objReference;
  }
  public get senderReference(): ShortEntity {
    return this._senderReference;
  }
  constructor(
    private readonly _senderReference: ShortEntity,
    private readonly _objReference: ShortEntity,
    private readonly _receiverReference: ShortEntity,
  ) {
    super();
  }
  override toString() {
    return `${this.senderReference.displayname}:${this.objReference.displayname}:${this.receiverReference.displayname}`;
  }
}
