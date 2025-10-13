import { DisplayableEntity } from "../interfaceTypes/DisplayableEntity.ts";
import { ShortEntity } from "../interfaceTypes/ShortEntity.ts";

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
    return {
      displayname: this.getDisplayName(),
      id: this.getId(),
      equals(that: ShortEntity) {
        return this.displayname === that.displayname && this.id === that.id;
      },
      "with": () => {
        throw new Error("unimplemented");
      },
      "copy": () => {
        throw new Error("unimplemented");
      },
    };
  }
}
