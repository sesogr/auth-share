import { ShortEntity } from "../interfaceTypes/ShortEntity.ts";
import { ValueClass } from "./ValueClass.ts";

export class AllowedUserGroupMap extends ValueClass {
  public get groupId(): string {
    return this._groupRef.id;
  }

  public get groupRef(): ShortEntity {
    return this._groupRef;
  }

  public get userRef(): ShortEntity {
    return this._userRef;
  }

  public get groupname(): string {
    return this._groupRef.displayname;
  }
  public get userId(): string {
    return this._userRef.id;
  }
  public get username(): string {
    return this._userRef.displayname;
  }
  public get isOwner(): boolean {
    return this._isOwner;
  }
  constructor(
    private readonly _userRef: ShortEntity,
    private readonly _groupRef: ShortEntity,
    private readonly _isOwner: boolean = false,
  ) {
    super();
  }
  override toString(): string {
    return `${this.userId}:${this.groupId}:${this.isOwner}`;
  }
}
