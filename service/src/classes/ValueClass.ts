export abstract class ValueClass {
  equals(that: ValueClass): boolean {
    return this.toString() === that.toString();
  }
  abstract toString(): string;
}
