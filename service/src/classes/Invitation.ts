import {IdNameMap} from "./IdNameMap.ts";
import {ValueClass} from "./ValueClass.ts";

export class Invitation extends ValueClass<Invitation> {
    public get receiverName(): string {
        return this.receiverReference.displayname;
    }

    public get receiverId(): string {
        return this.receiverReference.id;
    }

    public get objName(): string {
        return this.objReference.displayname;
    }

    public get objId(): string {
        return this.objReference.id;
    }

    public get senderId(): string {
        return this.senderReference.id;
    }

    public get senderName(): string {
        return this.senderReference.displayname;
    }

    constructor(
        readonly senderReference: IdNameMap,
        readonly objReference: IdNameMap,
        readonly receiverReference: IdNameMap,
    ) {
        super();
        Object.freeze(this);
    }

    override toString() {
        return `${this.senderName}:${this.objName}:${this.receiverName}`;
    }
}
