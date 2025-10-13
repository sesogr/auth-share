import { ValueClass } from "./ValueClass.ts";
import { ShortEntity } from "../interfaceTypes/ShortEntity.ts";
import { DuplicateError } from "../errors/DuplicateError.ts";

export class Invitation extends ValueClass {
  public get receiverReference(): ShortEntity {
    return this._receiverReference.copy();
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
    return this._objReference.copy();
  }
  public get senderReference(): ShortEntity {
    return this._senderReference.copy();
  }
  constructor(
    private readonly _senderReference: ShortEntity,
    private readonly _objReference: ShortEntity,
    private readonly _receiverReference: ShortEntity,
  ) {
    super();
  }

  override with(
    newStuff: {
      sender?: ShortEntity;
      obj?: ShortEntity;
      receiver?: ShortEntity;
    },
  ): ValueClass {
    const newSender = newStuff.sender ?? this.senderReference.copy();
    const newObj = newStuff.obj ?? this.objReference.copy();
    const newReceiver = newStuff.receiver ?? this.receiverReference.copy();
    const newInvite = new Invitation(newSender, newObj, newReceiver);
    if (newInvite.equals(this)) {
      throw new DuplicateError(newInvite + " is the same");
    }
    return newInvite;
  }
  override copy(): Invitation {
    return new Invitation(
      this.senderReference,
      this.objReference,
      this.receiverReference,
    );
  }
  override toString() {
    return `${this.senderReference.displayname}:${this.objReference.displayname}:${this.receiverReference.displayname}`;
  }
}
