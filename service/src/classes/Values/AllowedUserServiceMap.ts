import { IdNameMap } from "./IdNameMap.ts";
import { ValueClass } from "../ValueClass.ts";

export class AllowedUserServiceMap extends ValueClass<AllowedUserServiceMap> {
  public get getServiceId(): string {
    return this.serviceRef.id;
  }
  public get getServicename(): string {
    return this.serviceRef.displayname;
  }
  public get getUsername(): string {
    return this.userRef.displayname;
  }
  public get getUserId(): string {
    return this.userRef.id;
  }

  constructor(
    readonly userRef: IdNameMap,
    readonly serviceRef: IdNameMap,
    readonly isOwner: boolean = false,
  ) {
    super();
    Object.freeze(this);
  }
  override toString(): string {
    return `${this.getUserId}:${this.getServiceId}:${this.isOwner}`;
  }
}
