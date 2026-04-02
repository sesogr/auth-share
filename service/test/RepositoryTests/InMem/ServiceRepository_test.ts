import { assertEquals } from "@std/assert";
import { InMemServiceRepository } from "../../../src/classes/Repositories/InMem$Repositories/InMemServiceRepository.ts";
import { Service } from "../../../src/classes/Entities/Service.ts";
import { FakeObjectGen } from "../../../src/classes/FakeObjectGen.ts";
import { ServiceRepository } from "../../../interfaceTypes/ServiceRepository.ts";
import { User } from "../../../src/classes/Entities/User.ts";
import { UserCredential } from "../../../src/classes/Values/UserCredential.ts";

Deno.test("ServiceRepository", async (t) => {
  const { serviceList, serviceRepository }: ServiceRepositoryTestSuit =
    await buildUp();
  await t.step("findById", async () => {
    const testService = await serviceRepository.findById(
      serviceList[0].getId(),
    );
    assertEquals(testService.getId(), serviceList[0].getId());
  });
  await t.step("InMemServiceRepository - save", async () => {
    // Test the save method
    // const newService = Service.createService(
    //   { id: "credentials-id", secret: "credentials-secret" },
    //   "New Service",
    //   "owner-id"
    // );
    const user = new User(
      new UserCredential("credentials-id", "credentials-secret", ""),
      "TestUser1234",
      "1234567",
    );
    const currService = serviceList[3];
    currService.giveAuthorizationToUser(user);
    await serviceRepository.save(currService);

    // Assert that the service was saved correctly
    const savedService = await serviceRepository.findById(currService.getId());
    assertEquals(
      savedService.listAllowedUsers(),
      currService.listAllowedUsers(),
    );
    // must add test for removeAuthorization
    //test for steps ()
    // Add other assertions as needed
  });
});

type ServiceRepositoryTestSuit = {
  serviceList: Service[];
  serviceRepository: ServiceRepository;
};

async function buildUp(): Promise<ServiceRepositoryTestSuit> {
  const serviceList: Service[] = await FakeObjectGen.generateFakeServices();
  const serviceRepository: ServiceRepository = new InMemServiceRepository();
  await Promise.all(
    serviceList.map(async (e) => await serviceRepository.save(e)),
  );
  return { serviceList, serviceRepository };
}
