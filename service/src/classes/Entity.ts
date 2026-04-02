import { DisplayableEntity } from "../../interfaceTypes/DisplayableEntity.ts";
import { IdNameMap } from "./Values/IdNameMap.ts";
import { Invitation } from "./Values/Invitation.ts";

export class Entity implements DisplayableEntity {
  public get sentInvitations(): Invitation[] {
    throw new Error();
  }
  constructor(
    protected readonly id: string,
    protected readonly displayname: string,
    readonly type: string,
  ) {}
  getDisplayName(): string {
    return this.displayname;
  }
  getId(): string {
    return this.id;
  }
  convertToShort(): IdNameMap {
    return new IdNameMap(
      this.getId(),
      this.getDisplayName(),
    );
  }
}
