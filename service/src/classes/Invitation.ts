import { ValueClass } from "./ValueClass.ts";
import { ShortEntity } from "../interfaceTypes/ShortEntity.ts";

export class Invitation extends ValueClass {
  public get receiverReference(): ShortEntity {
    return this._receiverReference;
  }

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
