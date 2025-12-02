import { IdNameMap } from "./IdNameMap.ts";
import { ValueClass } from "./ValueClass.ts";

export class AllowedGroupServiceMap extends ValueClass<AllowedGroupServiceMap> {
  public get groupId(): string {
    return this._groupRef.id;
  }
  public get groupname(): string {
    return this._groupRef.displayname;
  }
  public get serviceId(): string {
    return this._serviceRef.id;
  }
  public get servicename(): string {
    return this._serviceRef.displayname;
  }

  public get serviceRef(): IdNameMap {
    return this._serviceRef;
  }

  public get groupRef(): IdNameMap {
    return this.groupRef;
  }

  constructor(
    private readonly _groupRef: IdNameMap,
    private readonly _serviceRef: IdNameMap,
  ) {
    super();
  }
  override toString(): string {
    return `${this.groupId}:${this.serviceId}`;
  }
}
