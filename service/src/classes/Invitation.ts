import { ValueClass } from "./ValueClass.ts";
import { Displayable } from "../interfaces/Displayable.ts";
export class Invitation<T extends Displayable> extends ValueClass {
  constructor(
    private readonly sendername: string,
    private readonly reference: T
  ) {
    super();
  }
  toString() {
    return `${this.sendername}:${this.reference.getDisplayName()}`;
  }
  equals(that: Invitation<T>) {
    return this.toString() === that.toString();
  }
  getReference(): T {
    return this.reference;
  }
}
