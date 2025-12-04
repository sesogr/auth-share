import { OnlyProperties } from "../types/OnlyProperties.ts";

export abstract class ValueClass<T extends ValueClass<T>> {
  //every key is a string --> that mapps to a primitive type. RecursiveValueClass is ValueClass<RecursiveValueClass>
  [key: string]:
    | string
    | number
    | bigint
    | symbol
    | undefined
    | RecursiveValueClass
    | ((...args: never[]) => unknown)
    | boolean;
  constructor() {
  }
  equals(that: T): boolean {
    return this.toString() === that.toString();
  }
  toString(): string {
    return Object.values(this).join(":");
  }
  copy(): T {
    //??
    const instance = Object.create(Object.getPrototypeOf(this));
    //make sure that the new instance has the old?
    return Object.assign(instance, this);
  }
  with(newData: Partial<OnlyProperties<T>>): T {
    const instance = Object.create(Object.getPrototypeOf(this));
    Object.assign(instance, this);
    return Object.assign(instance, newData);
  }
}
type RecursiveValueClass = ValueClass<RecursiveValueClass>;
