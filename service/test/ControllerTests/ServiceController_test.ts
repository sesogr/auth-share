import { Context } from "@hono/hono";
import { ServiceController } from "../../src/controller/ServiceController.ts";
import { ServiceRepository } from "../../src/interfaceTypes/ServiceRepository.ts";
import { UserRepository } from "../../src/interfaceTypes/UserRepository.ts";
import { stub } from "@std/testing/mock";
import { User } from "../../src/classes/User.ts";
import { Service } from "../../src/classes/Service.ts";

Deno.test("DbServiceController", async (t) => {
  await t.step("list my Service", async () => {
    const { serviceController, mockContext } = buildUp();
    const _serviceList =
      (await serviceController.listMyServices(mockContext)) as unknown as [];
    console.log(_serviceList);
  });

  function buildUp() {
    const serviceRepo = {
      findOwnedByUserId: (_a) => {
        return Promise.resolve([] as unknown as Service[]);
      },
    } as ServiceRepository;
    const userRepo = {} as UserRepository;
    const user = { getId: () => "123" } as User;
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
    console.log(_getMeFromContext);
    return { serviceController, mockContext };
  }
});
