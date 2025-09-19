import { ValueClass } from "./ValueClass.ts";

export class AllowedUserGroupMap extends ValueClass {
  public get groupId(): string {
    return this._groupId;
  }
  public get userId(): string {
    return this._userId;
  }
  constructor(
    private readonly _groupId: string,
    private readonly _userId: string,
  ) {
    super();
  }
  override toString(): string {
    return `${this.userId}:${this.groupId}`;
  }
}
