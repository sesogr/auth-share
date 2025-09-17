import { Service } from "../Service.ts";
import { InMemoryRepository } from "./InMemoryRepository.ts";

export class ServiceRepository extends InMemoryRepository<Service> {
  findOwnedByUserId(userId: string): Service[] {
    return this.inMemList.filter((s) =>
      s.listOwners().some((u) => u.getId() === userId)
    );
  }
}
