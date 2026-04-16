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
import { TestGroup } from "../StubbedClasses/TestGroup.ts";
import { TestUser } from "../StubbedClasses/TestUser.ts";
import { IdNameMap } from "../../src/classes/Values/IdNameMap.ts";
import { Invitation } from "../../src/classes/Values/Invitation.ts";
import { stub } from "@std/testing/mock";

Deno.test("ServiceController", async (t) => {
  const serviceRepo = TestServiceRepo.create();
  const ramLogger = new RamOnlyLog();
  const userRepo = TestUserRepo.create<RepositoryView<User>>();
  const groupRepo = TestGroupRepo.create<RepositoryView<Group>>();
  const mockedService = TestService.create();
  const mockedUser = TestUser.create();
  const mockedGroup = TestGroup.create();
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
  const groupList = await Promise.all(
    [1, 2, 3, 4].map(() => FakeObjectGen.createFakeGroup(undefined, fakeMe)),
  );
  const convertedGroupList = groupList.map((group) => group.toJson());
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
      mockContext.registerOutput("json", Promise.resolve("returned"));
      const returned = (await serviceController.promoteUsersOfService(
        mockContext,
      )) as unknown as string;
      assertEquals(returned, "returned");
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
  await t.step("acceptInvitation", async (st) => {
    await st.step("all good", async () => {
      const groupData = { ...convertedGroupList[0] };
      groupData["serviceInvitations"] = [1, 2].map(
        (_) => "sender:obj:receiver:service",
      );
      mockContext.reset();
      groupRepo.reset();
      mockedGroup.reset();
      mockedService.reset();
      mockedUser.reset();
      mockContext.req.registerOutput("json", Promise.resolve(groupData));
      mockedGroup.registerOutput("getDisplayName", "receiver", true);
      groupRepo.registerOutput(
        "findById",
        Promise.resolve(mockedGroup),
      );
      serviceRepo.registerOutput("findByDisplayName", mockedService, true);
      userRepo.registerOutput("findByDisplayName", mockedUser, true);
      const idNameMap = new IdNameMap("1", "2");
      const invite = new Invitation(idNameMap, idNameMap, idNameMap, "service");
      mockedService.registerOutput("convertToShort", idNameMap, true);
      mockedService.registerOutput("acceptInvitation", new Error("generic"));
      mockedUser.registerOutput("convertToShort", idNameMap, true);
      mockedGroup.registerOutput("convertToShort", idNameMap, true);
      mockContext.registerOutput("json", Promise.resolve("returned"));
      const returned = await serviceController.acceptInvitation(
        mockContext,
      ) as unknown as string;
      assertEquals(returned, "returned");
      assertEquals(mockContext.lastArgs("json"), [{
        fulfilled: [invite.toString()],
        rejected: ["generic"],
      }]);
      assertEquals(mockedGroup.stub["checkOwner"].args[0], [fakeMe]);
      assertEquals(mockedService.stub["checkOwner"].args[0], [mockedUser]);
      assertEquals(mockedService.stub["acceptInvitation"].args[0], [invite]);
      assertEquals(serviceRepo.stub["save"].args[0], [mockedService]);
      serviceRepo.reset(true);
      userRepo.reset(true);
      mockedService.reset(true);
      mockedUser.reset(true);
      mockedGroup.reset(true);
    });
  });
  await t.step("delete", async (st) => {
    await st.step("all good", async () => {
      mockContext.reset();
      serviceRepo.reset();
      mockedService.reset();
      serviceRepo.registerOutput("findById", Promise.resolve(mockedService));
      mockContext.req.registerOutput(
        "json",
        Promise.resolve(convertedServiceList[0]),
      );
      mockContext.registerOutput("body", "returned");
      const returned =
        (await serviceController.delete(mockContext)) as unknown as string;
      assertEquals(returned, "returned");
      assertEquals(mockContext.lastArgs("body"), [null, 204]);
      assertEquals(serviceRepo.lastArgs("findById"), [
        convertedServiceList[0].id,
      ]);
      assertEquals(mockedService.stub["checkOwner"].args[0], [fakeMe]);
      assertEquals(serviceRepo.lastArgs("delete"), [mockedService]);
    });
  });

  await t.step(
    "every controller method returns errorHandle if it catches an error",
    async () => {
      //@ts-ignore protected member
      const errorHandleStub = stub(
        serviceController,
        //@ts-ignore type safety override makes problems
        "errorHandle",
        () => "returned",
      );
      mockContext.reset(true);
      const errorObject = new Error("generic");
      mockContext.registerOutput("get", errorObject, true);
      const returned: string[] = [];
      returned.push(
        await serviceController.listMyServices(
          mockContext,
        ) as unknown as string,
      );
      returned.push(
        await serviceController.add(mockContext) as unknown as string,
      );
      returned.push(
        await serviceController.addUsersToService(
          mockContext,
        ) as unknown as string,
      );
      returned.push(
        await serviceController.promoteUsersOfService(
          mockContext,
        ) as unknown as string,
      );
      returned.push(
        await serviceController.acceptInvitation(
          mockContext,
        ) as unknown as string,
      );
      returned.push(
        await serviceController.delete(mockContext) as unknown as string,
      );

      function createListWithCountOfMethodCalls<K>(returned1: K): K[] {
        return [...returned].map((_) => returned1);
      }

      assertEquals(returned, createListWithCountOfMethodCalls("returned"));
      assertEquals(
        errorHandleStub.calls.length,
        returned.length,
      );
      assertEquals(
        errorHandleStub.calls.map((e) => e.args),
        createListWithCountOfMethodCalls([errorObject, mockContext]),
      );
      mockContext.reset(true);
      mockContext.registerOutput("get", fakeMe, true);
    },
  );
});
