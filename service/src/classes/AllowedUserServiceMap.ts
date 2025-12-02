import { IdNameMap } from "./IdNameMap.ts";
import { ValueClass } from "./ValueClass.ts";

export class AllowedUserServiceMap extends ValueClass<AllowedUserServiceMap> {
  public get serviceId(): string {
    return this.serviceRef.id;
  }
  public get servicename(): string {
    return this.serviceRef.displayname;
  }
  public get username(): string {
    return this.userRef.displayname;
  }
  public get userId(): string {
    return this.userRef.id;
  }

  constructor(
    private readonly userRef: IdNameMap,
    private readonly serviceRef: IdNameMap,
    readonly isOwner: boolean = false,
  ) {
    super();
  }
  override toString(): string {
    return `${this.userId}:${this.serviceId}:${this.isOwner}`;
  }
}
