import { ValueClass } from "./ValueClass.ts";

export class Invitation extends ValueClass {
  constructor(
    private readonly sendername: string,
    private readonly reference: string
  ) {
    super();
  }
  toString() {
    return `${this.sendername}:${this.reference}`;
  }
  equals(that: Invitation) {
    return this.toString() === that.toString();
  }
}
