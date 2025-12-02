import { DisplayableEntity } from "../interfaceTypes/DisplayableEntity.ts";
import { IdNameMap } from "../interfaceTypes/ShortEntity.ts";
import { IdNameMap } from "./IdNameMap.ts";
import { Invitation } from "./Invitation.ts";

export class Entity implements DisplayableEntity {
  public get sentInvitations(): Invitation[] {
    throw new Error();
  }
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
  convertToShort(): IdNameMap {
    return new IdNameMap(
      this.getId(),
      this.getDisplayName(),
    );
  }
}
