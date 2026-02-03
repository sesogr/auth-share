import { assertEquals } from "@std/assert";
import { InMemServiceRepository } from "../src/classes/Repositories/InMem$Repositories/InMemServiceRepository.ts";
import { Service } from "../src/classes/Service.ts";
import { FakeObjectGen } from "../src/FakeObjectGen.ts";
import { ServiceRepository } from "../src/interfaceTypes/ServiceRepository.ts";
import { User } from "../src/classes/User.ts";
import { UserCredential } from "../src/classes/UserCredential.ts";

Deno.test("ServiceRepository", async (t) => {
  await t.step("findById", async () => {
    const { serviceList, serviceRepository }: ServiceRepositoryTestsuit =
      await buildUp();
    const testService = await serviceRepository.findById(
      serviceList[0].getId(),
    );
    assertEquals(testService.getId(), serviceList[0].getId());
  });
  await t.step("InMemServiceRepository - save", async () => {
    const { serviceList, serviceRepository }: ServiceRepositoryTestsuit =
      await buildUp();

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

type ServiceRepositoryTestsuit = {
  serviceList: Service[];
  serviceRepository: ServiceRepository;
};

async function buildUp(): Promise<ServiceRepositoryTestsuit> {
  const serviceList: Service[] = await FakeObjectGen.generateFakeServices();
  const serviceRepository: ServiceRepository = new InMemServiceRepository();
  await Promise.all(
    serviceList.map(async (e) => await serviceRepository.save(e)),
  );
  return { serviceList, serviceRepository };
}
