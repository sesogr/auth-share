import { DuplicateError } from "../errors/DuplicateError.ts";
import { ShortEntity } from "../interfaceTypes/ShortEntity.ts";
import { ValueClass } from "./ValueClass.ts";

export class IdNameMap extends ValueClass implements ShortEntity {
  constructor(readonly id: string, readonly displayname: string) {
    super();
  }

  override toString(): string {
    return `${this.id}:${this.displayname}`;
  }
  override copy(): IdNameMap {
    return new IdNameMap(this.id, this.displayname);
  }
  override with(newStuff: { id?: string; displayname?: string }): IdNameMap {
    const newId = newStuff.id ?? this.id;
    const newDisplayname = newStuff.displayname ?? this.displayname;

    const newNameMap = new IdNameMap(newId, newDisplayname);
    if (newNameMap.equals(this)) {
      throw new DuplicateError(newNameMap + " is the same");
    }
    return newNameMap;
  }
}
