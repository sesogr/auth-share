import { IdNameMap } from "./IdNameMap.ts";
import { ValueClass } from "./ValueClass.ts";

export class AllowedUserGroupMap extends ValueClass<AllowedUserGroupMap> {
  public get groupId(): string {
    return this._groupRef.id;
  }

  public get groupRef(): IdNameMap {
    return this._groupRef;
  }

  public get userRef(): IdNameMap {
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
    private readonly _userRef: IdNameMap,
    private readonly _groupRef: IdNameMap,
    private readonly _isOwner: boolean = false,
  ) {
    super();
  }
  override toString(): string {
    return `${this.userId}:${this.groupId}:${this.isOwner}`;
  }
}
