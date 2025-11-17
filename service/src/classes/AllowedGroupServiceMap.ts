import { ShortEntity } from "../interfaceTypes/ShortEntity.ts";
import { ValueClass } from "./ValueClass.ts";

export class AllowedGroupServiceMap extends ValueClass {
  override with(_: object): ValueClass {
    throw new Error("Method not implemented.");
  }
  override copy(): ValueClass {
    throw new Error("Method not implemented.");
  }
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

  public get serviceRef(): ShortEntity {
    return this._serviceRef;
  }

  public get groupRef(): ShortEntity {
    return this.groupRef;
  }

  constructor(
    private readonly _groupRef: ShortEntity,
    private readonly _serviceRef: ShortEntity,
  ) {
    super();
  }
  override toString(): string {
    return `${this.groupId}:${this.serviceId}`;
  }
}
