import { ValueClass } from "./ValueClass.ts";

export class AllowedUserMap extends ValueClass {
  public get isOwner(): boolean {
    return this._isOwner;
  }
  public get serviceId(): string {
    return this._serviceId;
  }
  public get userId(): string {
    return this._userId;
  }
  constructor(
    private readonly _userId: string,
    private readonly _serviceId: string,
    private readonly _isOwner: boolean = false,
  ) {
    super();
  }
  override toString(): string {
    return `${this.userId}:${this.serviceId}`;
  }
}
