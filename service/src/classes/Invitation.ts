import { IdNameMap } from "./IdNameMap.ts";
import { ValueClass } from "./ValueClass.ts";

export class Invitation extends ValueClass<Invitation> {
  public get reveicername(): string {
    return this._receiverReference.displayname;
  }

  public get receiverId(): string {
    return this._receiverReference.id;
  }

  public get objname(): string {
    return this._objReference.displayname;
  }
  public get objId(): string {
    return this._objReference.id;
  }

  public get senderId(): string {
    return this._senderReference.id;
  }

  public get sendername(): string {
    return this._senderReference.displayname;
  }
  constructor(
    private readonly _senderReference: IdNameMap,
    private readonly _objReference: IdNameMap,
    private readonly _receiverReference: IdNameMap,
  ) {
    super();
  }
  override toString() {
    return `${this.sendername}:${this.objname}:${this.reveicername}`;
  }
}
