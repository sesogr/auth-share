import { ShortEntity } from "../interfaceTypes/ShortEntity.ts";
import { ValueClass } from "./ValueClass.ts";

export class IdNameMap extends ValueClass implements ShortEntity {
  constructor(readonly id: string, readonly displayname: string) {
    super();
  }

  override toString(): string {
    return `${this.id}:${this.displayname}`;
  }
}
