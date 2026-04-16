import { ServiceController } from "../../src/classes/controller/ServiceController.ts";
import { User } from "../../src/classes/Entities/User.ts";
import { assertEquals } from "@std/assert";
import { FakeObjectGen } from "../../src/classes/FakeObjectGen.ts";
import { RamOnlyLog } from "../RamOnlyLog.ts";
import { RepositoryView } from "../../interfaceTypes/RepositoryView.ts";
import { Group } from "../../src/classes/Entities/Group.ts";
import { TestContext } from "../StubbedClasses/TestContext.ts";
import { TestServiceRepo } from "../StubbedClasses/TestServiceRepo.ts";
import { TestUserRepo } from "../StubbedClasses/TestUserRepo.ts";
import { TestGroupRepo } from "../StubbedClasses/TestGroupRepo.ts";
import { NotFoundError } from "../../src/classes/errors/NotFoundError.ts";
import { AlreadyTakenError } from "../../src/classes/errors/controllerErrors/ConflictError/AlreadyTakenError.ts";
import { ConvertedUser } from "../../src/types/ConvertedUser.ts";
import { TestService } from "../StubbedClasses/TestService.ts";

Deno.test("ServiceController", async (t) => {
  const serviceRepo = TestServiceRepo.create();
  const ramLogger = new RamOnlyLog();
  const userRepo = TestUserRepo.create<RepositoryView<User>>();
  const groupRepo = TestGroupRepo.create<RepositoryView<Group>>();
  const mockedService = TestService.create();
  const serviceController = new ServiceController(
    serviceRepo,
    userRepo,
    groupRepo,
    ramLogger,
  );
  const fakeMe = await FakeObjectGen.createFakeUser();
  const serviceList = await Promise.all([
    1,
    2,
    3,
    4,
  ].map(() => FakeObjectGen.createFakeService(fakeMe)));
  const userList: User[] = await Promise.all([
    1,
    2,
    3,
    4,
  ].map(() => FakeObjectGen.createUnvalidatedUser()));
  const convertedServiceList = serviceList.map((service) => service.toJson());
  const mockContext = TestContext.create();
  mockContext.registerOutput("get", fakeMe, true);

  await t.step("list my Service", async (st) => {
    await st.step("all good", async () => {
      mockContext.reset();
      serviceRepo.reset();
      serviceRepo.registerOutput(
        "findOwnedByUserId",
        Promise.resolve(serviceList),
      );
      await serviceController.listMyServices(mockContext);
      assertEquals(
        mockContext.lastArgs("json")[0],
        convertedServiceList,
      );
    });
  });

  await t.step("add", async (st) => {
    await st.step("all good", async () => {
      mockContext.reset();
      serviceRepo.reset();
      mockContext.req.registerOutput("json", convertedServiceList[0]);
      await serviceController.add(mockContext);
      const savedService = serviceRepo.stub["save"].args[0][0];
      assertEquals(savedService.credentials, serviceList[0].credentials);
      assertEquals(
        savedService.getDisplayName(),
        serviceList[0].getDisplayName(),
      );
      assertEquals(savedService.serviceUrl, serviceList[0].serviceUrl);
      assertEquals(mockContext.lastArgs("body"), [null, 201]);
    });
  });
  await t.step("addUsersToService", async (st) => {
    await st.step("all good", async () => {
      mockContext.reset();
      serviceRepo.reset();
      userRepo.reset();
      const serviceData = { ...convertedServiceList[0] };
      serviceData.users = [
        ...serviceData.users!,
        userList[0].getDisplayName(),
        userList[1].getDisplayName(),
      ];
      mockContext.req.registerOutput("json", serviceData);
      serviceRepo.registerOutput("findById", Promise.resolve(serviceList[0]));
      userRepo.registerOutput(
        "findByDisplayName",
        Promise.resolve(userList[0]),
      );
      userRepo.registerOutput(
        "findByDisplayName",
        Promise.resolve(userList[1]),
      );
      await serviceController.addUsersToService(mockContext);
      const savedService = serviceRepo.stub["save"].args[0][0];
      const response = mockContext.lastArgs("json") as [{
        resolved: ConvertedUser[];
        rejected: NotFoundError[];
        alreadyIn: AlreadyTakenError[];
      }, number];

      assertEquals(savedService.toJson(), serviceData);
      assertEquals(
        response[0].resolved,
        [userList[0], userList[1]].map((e) => e.toJson()),
      );
      assertEquals(response[0].rejected, []);
      assertEquals(response[0].alreadyIn, []);
      assertEquals(response[1], 200);
    });
  });

  await t.step("promoteUsersOfService", async (st) => {
    await st.step("all good", async () => {
      mockContext.reset();
      serviceRepo.reset();
      userRepo.reset();
      mockedService.reset();
      const serviceData = { ...convertedServiceList[0] };
      serviceData["owners"] = ["1", "2", "3"];
      mockContext.req.registerOutput("json", Promise.resolve(serviceData));
      serviceRepo.registerOutput("findById", Promise.resolve(mockedService));
      mockedService.registerOutput(
        "promoteUser",
        new AlreadyTakenError("", ""),
      );
      mockedService.registerOutput(
        "promoteUser",
        new NotFoundError("", "", ""),
      );
      await serviceController.promoteUsersOfService(mockContext);
      assertEquals(serviceRepo.lastArgs("findById"), [serviceData.id]);
      assertEquals(mockedService.stub["checkOwner"].args[0], [fakeMe]);
      assertEquals(serviceRepo.lastArgs("save"), [mockedService]);
      assertEquals(mockContext.lastArgs("json"), [{
        promoted: ["3"],
        alreadyIn: ["1"],
        rejected: ["2"],
      }]);
    });
  });
});
