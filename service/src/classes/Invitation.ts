import { IdNameMap } from "./IdNameMap.ts";
import { ValueClass } from "./ValueClass.ts";

export class Invitation extends ValueClass<Invitation> {
  public get receivername(): string {
    return this.receiverReference.displayname;
  }

  public get receiverId(): string {
    return this.receiverReference.id;
  }

  public get objname(): string {
    return this.objReference.displayname;
  }
  public get objId(): string {
    return this.objReference.id;
  }

  public get senderId(): string {
    return this.senderReference.id;
  }

  public get sendername(): string {
    return this.senderReference.displayname;
  }
  constructor(
    readonly senderReference: IdNameMap,
    readonly objReference: IdNameMap,
    readonly receiverReference: IdNameMap,
  ) {
    super();
  }
  override toString() {
    return `${this.sendername}:${this.objname}:${this.receivername}`;
  }
}
