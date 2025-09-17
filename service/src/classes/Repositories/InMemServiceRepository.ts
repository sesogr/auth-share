import { FakeObjectGen } from "../../FakeObjectGen.ts";
import { ServiceRepository } from "../../interfaceTypes/ServiceRepository.ts";

import { Service } from "../Service.ts";
import { User } from "../User.ts";
import { InMemoryRepository } from "./InMemoryRepository.ts";

export class InMemServiceRepository extends InMemoryRepository<Service>
  implements ServiceRepository {
  constructor(user: User) {
    const serviceList: Service[] = [];
    for (let i = 0; i < 10; i++) {
      const fakeService = FakeObjectGen.createFakeService(user);
      serviceList.push(fakeService);
    }
    super(serviceList);
  }
  findOwnedByUserId(userId: string): Service[] {
    return this.inMemList.filter((s) =>
      s.listOwners().some((u) => u.getId() === userId)
    );
  }
}
