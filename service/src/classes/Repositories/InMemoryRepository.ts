import { Entity } from "../../interfaceTypes/Entity.ts";
import { Displayable } from "../../interfaceTypes/Displayable.ts";
import { Repository } from "../../interfaceTypes/Repository.ts";
import { NotFoundError } from "../../errors/NotFoundError.ts";
import { ItemAlreadyExistsError } from "../../errors/ItemAlreadyExistsError.ts";

export class InMemoryRepository<T extends Displayable & Entity>
  implements Repository<T> {
  protected inMemList: T[] = [];

  constructor(initial: T[] = []) {
    this.inMemList = initial.slice();
  }

  findById(id: string): T {
    const found = this.inMemList.find((i) => i.getId() === id);
    if (!found) throw new NotFoundError(`Item with id=${id} not found`);
    return found;
  }

  findByName(name: string): T {
    if (!this.inMemList.some((i) => i.getDisplayName() === name)) {
      throw new NotFoundError(`Item with name=${name} not found`);
    }
    return this.inMemList.find((i) => i.getDisplayName() === name)!;
  }

  findAll(): T[] {
    return this.inMemList.slice();
  }
  add(item: T): void {
    if (this.inMemList.some((i) => i.getId() === item.getId())) {
      throw new ItemAlreadyExistsError(
        `Item with id=${item.getId()} already exists`,
      );
    }
    if (
      this.inMemList.some((i) => i.getDisplayName() === item.getDisplayName())
    ) {
      throw new ItemAlreadyExistsError(
        `Item with name=${item.getDisplayName()} already exists`,
      );
    }
    this.inMemList.push(item);
  }

  removeById(id: string): void {
    const before = this.inMemList.length;
    this.inMemList = this.inMemList.filter((i) => i.getId() !== id);
    if (this.inMemList.length >= before) throw Error("id not removed");
  }
  // findOwnedByUserName(userName: string): T[] {
  //   const ownedService = this.inMemList.filter((i) =>
  //     i.listOwners().some((o) => o.getDisplayName() === userName)
  //   );
  //   return ownedService;
}
