import { Repository } from "../interfaces/Repository.ts";
import { Service } from "./Service.ts";

export class InMemoryServiceRepository implements Repository<Service> {
  protected serviceList: Service[] = [];

  constructor(initial: Service[] = []) {
    this.serviceList = initial.slice();
  }
  findOwnedByUserName(userName: string): Service[] {
    const ownedService = this.serviceList.filter((i) =>
      i.listOwners().some((o) => o.getDisplayName() === userName)
    );
    return ownedService;
  }
  /**
    //id on repository-Level? do we need this at all?uuid?

    findById(id: string): Service {
    const found = this.items.find(i => i.getDisplayName() === id);
    if (!found) throw new Error(`Item with id=${id} not found`);
    return found;
  }
  */
  findByName(name: string): Service {
    const service = this.serviceList.find((i) => i.getDisplayName() === name);
    if (!service) throw new Error(`Item with name=${name} not found`);
    return service;
  }

  findAll(): Service[] {
    return this.serviceList.slice();
  }

  add(item: Service): void {
    if (
      this.serviceList.some((i) => i.getDisplayName() === item.getDisplayName())
    ) {
      throw new Error(
        `Item with getDisplayName=${item.getDisplayName()} already exists`,
      );
    }
    this.serviceList.push(item);
  }

  removeByName(name: string): boolean {
    const before = this.serviceList.length;
    this.serviceList = this.serviceList.filter((i) =>
      i.getDisplayName() !== name
    );
    return this.serviceList.length < before;
  }
}
