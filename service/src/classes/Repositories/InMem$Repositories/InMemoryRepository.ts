import { AlreadyTakenError } from "../../errors/controllerErrors/ConflictError/AlreadyTakenError.ts";
import { NotFoundError } from "../../errors/NotFoundError.ts";
import { Displayable } from "../../../../interfaceTypes/Displayable.ts";
import { Entity } from "../../../../interfaceTypes/Entity.ts";
import { Repository } from "../../../../interfaceTypes/Repository.ts";

export abstract class InMemoryRepository<T extends Displayable & Entity>
  implements Repository<T> {
  protected inMemList: T[] = [];

  protected constructor(initial: T[] = []) {
    this.inMemList = initial.slice();
  }

  delete(_item: T): Promise<void> {
    throw new Error("Method not implemented.");
  }

  abstract save(item: T): Promise<void>;

  abstract hydrate(item: T): Promise<T>;

  findById(id: string): Promise<T> {
    const item = this.inMemList.find((i) => i.getId() === id);
    if (!item) throw new NotFoundError("item", "id", id);
    return this.hydrate(item);
  }

  findByDisplayName(name: string): Promise<T> {
    const item = this.inMemList.find((i) => i.getDisplayName() === name);
    if (!item) {
      throw new NotFoundError("item", "displayname", name);
    }
    return this.hydrate(item);
  }

  findAll(): Promise<T[]> {
    return Promise.all(
      this.inMemList.slice().map((e) => this.hydrate(e)),
    );
  }

  add(item: T): Promise<void> {
    if (this.inMemList.some((i) => i.getId() === item.getId())) {
      throw new AlreadyTakenError(
        `Item with id=${item.getId()} already exists`,
        "id",
      );
    }
    if (
      this.inMemList.some((i) => i.getDisplayName() === item.getDisplayName())
    ) {
      throw new AlreadyTakenError(
        `Item with name=${item.getDisplayName()} already exists`,
        "displayname",
      );
    }
    this.inMemList.push(item);
    return Promise.resolve();
  }

  removeById(id: string): Promise<void> {
    const before = this.inMemList.length;
    this.inMemList = this.inMemList.filter((i) => i.getId() !== id);
    if (this.inMemList.length >= before) throw Error("id not removed");
    return Promise.resolve();
  }

  // findOwnedByUserName(userName: string): T[] {
  //   const ownedService = this.inMemList.filter((i) =>
  //     i.listOwners().some((o) => o.getDisplayName() === userName)
  //   );
  //   return ownedService;
}
