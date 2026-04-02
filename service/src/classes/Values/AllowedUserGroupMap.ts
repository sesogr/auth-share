import { IdNameMap } from "./IdNameMap.ts";
import { ValueClass } from "../ValueClass.ts";

export class AllowedUserGroupMap extends ValueClass<AllowedUserGroupMap> {
  public get getGroupId(): string {
    return this.groupRef.id;
  }

  public get getGroupname(): string {
    return this.groupRef.displayname;
  }
  public get getUserId(): string {
    return this.userRef.id;
  }
  public get getUsername(): string {
    return this.userRef.displayname;
  }
  constructor(
    readonly userRef: IdNameMap,
    readonly groupRef: IdNameMap,
    readonly isOwner: boolean = false,
  ) {
    super();
    Object.freeze(this);
  }
  override toString(): string {
    return `${this.getUserId}:${this.getGroupId}:${this.isOwner}`;
  }
}
