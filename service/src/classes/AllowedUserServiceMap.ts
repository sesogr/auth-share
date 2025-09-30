import { ShortEntity } from "../interfaceTypes/ShortEntity.ts";
import { ValueClass } from "./ValueClass.ts";

export class AllowedUserServiceMap extends ValueClass {
  public get isOwner(): boolean {
    return this._isOwner;
  }
  public get serviceId(): string {
    return this._serviceRef.id;
  }
  public get servicename(): string {
    return this._serviceRef.displayname;
  }
  public get username(): string {
    return this._userRef.displayname;
  }
  public get userId(): string {
    return this._userRef.id;
  }

  public get userRef(): ShortEntity {
    return this._userRef;
  }
  public get serviceRef(): ShortEntity {
    return this._serviceRef;
  }

  constructor(
    private readonly _userRef: ShortEntity,
    private readonly _serviceRef: ShortEntity,
    private readonly _isOwner: boolean = false,
  ) {
    super();
  }
  override toString(): string {
    return `${this.userId}:${this.serviceId}:${this.isOwner}`;
  }
}
