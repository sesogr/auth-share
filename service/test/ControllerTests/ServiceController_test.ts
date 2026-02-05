import {} from "@std/assert";
import { Context } from "@hono/hono";
import { ServiceController } from "../../src/controller/ServiceController.ts";
import { ServiceRepository } from "../../src/interfaceTypes/ServiceRepository.ts";
import { UserRepository } from "../../src/interfaceTypes/UserRepository.ts";
import { stub } from "@std/testing/mock";
import { User } from "../../src/classes/User.ts";
Deno.test("DbServiceController", async (t) => {
  await t.step("listmyService", async () => {
    const { serviceController, mockContext } = buildUp();
    const _serviceList =
      (await serviceController.listMyServices(mockContext)) as unknown as [];
  });

  function buildUp() {
    const serviceRepo = {
      findOwnedByUserId: (_a) => {
        return;
      },
    } as ServiceRepository;
    const userRepo = {} as UserRepository;
    const user = {} as User;
    const serviceController = new ServiceController(
      serviceRepo,
      userRepo,
    );
    const _getMeFromContext = stub(
      serviceController,
      // @ts-ignore Protected
      "getMeFromContext",
      () => {
        return Promise.resolve(user);
      },
    );
    const mockContext = {
      req: {},
      res: {},
      json: (e: object) => e,
    } as unknown as Context;
    return { serviceController, mockContext };
  }
});
