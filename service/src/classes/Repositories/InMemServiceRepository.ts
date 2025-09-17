import { ServiceRepository } from "../../interfaceTypes/ServiceRepository.ts";
import { Service } from "../Service.ts";
import { InMemoryRepository } from "./InMemoryRepository.ts";

export class InMemServiceRepository extends InMemoryRepository<Service>
  implements ServiceRepository {
  findOwnedByUserId(userId: string): Service[] {
    return this.inMemList.filter((s) =>
      s.listOwners().some((u) => u.getId() === userId)
    );
  }
}
