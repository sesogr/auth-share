import { IdNameMap } from "./IdNameMap.ts";
import { ValueClass } from "../ValueClass.ts";

export class AllowedGroupServiceMap extends ValueClass<AllowedGroupServiceMap> {
  public get getGroupId(): string {
    return this.groupRef.id;
  }
  public get getGroupname(): string {
    return this.groupRef.displayname;
  }
  public get getServiceId(): string {
    return this.serviceRef.id;
  }
  public get getServicename(): string {
    return this.serviceRef.displayname;
  }

  constructor(
    readonly groupRef: IdNameMap,
    readonly serviceRef: IdNameMap,
  ) {
    super();
    Object.freeze(this);
  }
  override toString(): string {
    return `${this.getGroupId}:${this.getServiceId}`;
  }
}
