import { ValueClass } from "./ValueClass.ts";

export class AllowedUserGroupMap extends ValueClass {
  public get groupId(): string {
    return this._groupId;
  }
  public get userId(): string {
    return this._userId;
  }
  public get isOwner(): boolean {
    return this._isOwner;
  }
  constructor(
    private readonly _userId: string,
    private readonly _groupId: string,
    private readonly _isOwner: boolean = false,
  ) {
    super();
  }
  override toString(): string {
    return `${this.userId}:${this.groupId}:${this.isOwner}`;
  }
}
