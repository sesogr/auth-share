import { ValueClass } from "./ValueClass.ts";

export class AllowedGroupMap extends ValueClass {
  public get groupId(): string {
    return this._groupId;
  }
  public get serviceId(): string {
    return this._serviceId;
  }
  constructor(
    private readonly _groupId: string,
    private readonly _serviceId: string,
  ) {
    super();
  }
  override toString(): string {
    return `${this.groupId}:${this.serviceId}`;
  }
}
