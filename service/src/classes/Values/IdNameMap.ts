import { ValueClass } from "../ValueClass.ts";

export class IdNameMap extends ValueClass<IdNameMap> {
  constructor(readonly id: string, readonly displayname: string) {
    super();
    Object.freeze(this);
  }
}
