import { DisplayableEntity } from "../interfaceTypes/DisplayableEntity.ts";
import { ShortEntity } from "../interfaceTypes/ShortEntity.ts";
import { IdNameMap } from "./IdNameMap.ts";

export class Entity implements DisplayableEntity {
  constructor(
    protected readonly id: string,
    protected readonly displayname: string,
  ) {}
  getDisplayName(): string {
    return this.displayname;
  }
  getId(): string {
    return this.id;
  }
  convertToShort(): ShortEntity { //hier eine IdNameMap macht probleme?
    return new IdNameMap(
      this.getId(),
      this.getDisplayName(),
    );
  }
}
