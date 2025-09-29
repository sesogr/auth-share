import { assertEquals } from "@std/assert";
import { InMemServiceRepository } from "../src/classes/Repositories/InMem$Repositories/InMemServiceRepository.ts";
import { Service } from "../src/classes/Service.ts";
import { FakeObjectGen } from "../src/FakeObjectGen.ts";
import { ServiceRepository } from "../src/interfaceTypes/ServiceRepository.ts";

Deno.test("ServiceRepository", async (t) => {
  await t.step("findById", () => {
    const { serviceList, serviceRepository }: ServiceRepositoryTestsuit =
      buildUp();
    const testService = serviceRepository.findById(serviceList[0].getId());
    assertEquals(testService.getId(), serviceList[0].getId());
  });
});

type ServiceRepositoryTestsuit = {
  serviceList: Service[];
  serviceRepository: ServiceRepository;
};

function buildUp(): ServiceRepositoryTestsuit {
  const serviceList: Service[] = FakeObjectGen.generateFakeServices();
  const serviceRepository: ServiceRepository = new InMemServiceRepository();
  serviceList.forEach((e) => serviceRepository.save(e));
  return { serviceList, serviceRepository };
}
