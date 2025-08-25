export abstract class ValueClass {
  abstract toString(): string;
  abstract equals(that: ValueClass): boolean;
}
