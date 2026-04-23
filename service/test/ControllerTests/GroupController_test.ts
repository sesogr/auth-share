import { GroupController } from "../../src/classes/controller/GroupController.ts";
import { TestGroupRepo } from "../StubbedClasses/TestGroupRepo.ts";
import { TestUserRepo } from "../StubbedClasses/TestUserRepo.ts";
import { TestServiceRepo } from "../StubbedClasses/TestServiceRepo.ts";
import { RamOnlyLog } from "../RamOnlyLog.ts";
import { TestContext } from "../StubbedClasses/TestContext.ts";
import { TestGroup } from "../StubbedClasses/TestGroup.ts";
import { assertEquals } from "@std/assert";
import { TestUser } from "../StubbedClasses/TestUser.ts";
import { stub } from "@std/testing/mock";
import { Group } from "../../src/classes/Entities/Group.ts";
import { IdNameMap } from "../../src/classes/Values/IdNameMap.ts";
import { Invitation } from "../../src/classes/Values/Invitation.ts";
import { NotFoundError } from "../../src/classes/errors/NotFoundError.ts";

Deno.test("GroupController", async (t) => {
  const goodReturn = "returned" as unknown;
  const mockGroupRepo = TestGroupRepo.create();
  const mockUserRepo = TestUserRepo.create();
  const mockServiceRepo = TestServiceRepo.create();
  const mockContext = TestContext.create();
  const fakeMe = TestUser.create();
  const mockUser = TestUser.create();
  mockContext.registerOutput("get", fakeMe, true);
  const ramLogger = new RamOnlyLog();
  const mockGroup = TestGroup.create();
  const groupController = new GroupController(
    mockGroupRepo.this,
    mockUserRepo.this,
    mockServiceRepo.this,
    ramLogger,
  );
  await t.step("delete", async () => {
    mockContext.reset();
    mockGroupRepo.reset();
    mockGroup.reset();
    fakeMe.reset();
    mockContext.req.registerOutput("json", { "id": "123" });
    mockContext.registerOutput("body", goodReturn);
    mockGroupRepo.registerOutput("findById", mockGroup.this);
    const returned = await groupController.delete(mockContext.this);
    assertEquals(returned, goodReturn);
    assertEquals(mockGroupRepo.stub["findById"].args[0][0], "123");
    assertEquals(mockGroup.stub["checkOwner"].args[0][0], fakeMe.this);
    assertEquals(mockGroupRepo.stub["delete"].args[0][0], mockGroup.this);
    assertEquals(mockContext.stub["body"].args[0], [null, 204 as unknown]);
    assertEquals(fakeMe.stub["checkValidation"].counter, 1);
  });
  await t.step("listMyGroups", async () => {
    mockContext.reset();
    mockGroupRepo.reset();
    mockGroup.reset();
    fakeMe.reset();
    fakeMe.registerOutput("getId", "1234");
    mockGroup.registerOutput("toJson", { id: "123" }, true);
    const mockGroupArray = [
      mockGroup.this,
      mockGroup.this,
      mockGroup.this,
    ];
    mockGroupRepo.registerOutput("findOwnedByUserId", mockGroupArray);
    mockContext.registerOutput("json", goodReturn);
    const returned = await groupController.listMyGroups(
      mockContext.this,
    );
    assertEquals(returned, goodReturn);
    assertEquals(mockGroup.counter("checkOwner"), mockGroupArray.length);
    assertEquals(mockGroup.counter("toJson"), mockGroupArray.length);
    assertEquals(mockGroupRepo.stub["findOwnedByUserId"].args[0][0], "1234");
    assertEquals(mockContext.lastArgs("json"), [[{ id: "123" }, { id: "123" }, {
      id: "123",
    }]]);
    mockGroup.reset(true);
  });
  await t.step("createGroup", async () => {
    mockContext.reset();
    mockGroupRepo.reset();
    mockGroup.reset();
    fakeMe.reset();
    const groupname = "name";
    mockContext.req.registerOutput("json", { "groupname": groupname });
    const groupFactoryStub = stub(
      Group,
      "createUserGroup",
      () => mockGroup.owned,
    );
    mockContext.registerOutput("body", goodReturn);
    const returned = await groupController.createGroup(mockContext.this);
    assertEquals(returned, goodReturn);
    assertEquals(groupFactoryStub.calls[0].args, [
      groupname,
      fakeMe.validated,
    ]);
    assertEquals(mockGroupRepo.stub["save"].args[0][0], mockGroup.this);
    assertEquals(mockContext.lastArgs("body"), [null, 204]);
  });
  await t.step("acceptInvitation", async () => {
    const counts = [0, 1, 2, 3];
    mockContext.reset();
    mockUser.reset();
    mockGroup.reset();
    fakeMe.reset();
    mockGroupRepo.reset();
    fakeMe.registerOutput("getDisplayName", "3", true);
    const invitationsData = counts.map(
      () => "1:2:3:group",
    );
    mockContext.req.registerOutput("json", {
      "userGroupInvitations": invitationsData,
    });
    const idNameMap = new IdNameMap("12", "123");
    const invitation = new Invitation(idNameMap, idNameMap, idNameMap, "group");
    counts.forEach(() => {
      mockGroupRepo.registerOutput("findByDisplayName", mockGroup.this);
      mockUserRepo.registerOutput("findByDisplayName", mockUser.this);
      mockGroup.registerOutput("convertToShort", idNameMap);
      mockUser.registerOutput("convertToShort", idNameMap);
      fakeMe.registerOutput("convertToShort", idNameMap);
    });
    mockContext.registerOutput("json", goodReturn);
    const returned = await groupController.acceptInvitation(mockContext.this);
    assertEquals(returned, goodReturn);
    assertEquals(mockContext.lastArgs("json"), [{
      fulfilled: counts.map(() => invitation.toString()),
      rejected: [],
    }]);
    assertEquals(
      mockGroup.stub["checkOwner"].args,
      counts.map(() => [mockUser.this]),
    );
    assertEquals(
      mockGroup.stub["acceptInvitation"].args,
      counts.map(() => [invitation]),
    );
    assertEquals(mockGroup.counter("checkOwner"), counts.length);
    fakeMe.reset(true);
  });
  await t.step("invite Users", async () => {
    mockContext.reset();
    mockGroup.reset();
    fakeMe.reset();
    mockGroupRepo.reset();
    mockUserRepo.reset();
    const count = [1, 2, 3, 4];
    mockContext.req.registerOutput(
      "json",
      {
        id: "123",
        sentInvitations: count.map(() => "1"),
      },
    );
    mockGroupRepo.registerOutput("findById", mockGroup.this);
    mockUserRepo.registerOutput("findByDisplayName", mockUser.this);
    mockUserRepo.registerOutput(
      "findByDisplayName",
      Promise.reject(new NotFoundError("user", "displayname", "123")),
    );
    mockUserRepo.registerOutput("findByDisplayName", mockUser.this);
    mockUserRepo.registerOutput("findByDisplayName", mockUser.this);
    mockGroup.registerOutput("sendMultipleInvitations", {
      fulfilled: [mockUser, mockUser, mockUser],
      alreadyIn: [mockUser],
    });
    count.forEach((i) => mockUser.registerOutput("getDisplayName", i));
    mockContext.registerOutput("json", goodReturn);
    const returned = await groupController.inviteUsers(mockContext.this);
    assertEquals(returned, goodReturn);
    assertEquals(mockGroupRepo.stub["findById"].args[0][0], "123");
    assertEquals(mockGroup.stub["checkOwner"].args[0][0], fakeMe.this);
    assertEquals(
      mockUserRepo.stub["findByDisplayName"].args,
      count.map(() => ["1"]),
    );
    assertEquals(mockGroup.stub["sendMultipleInvitations"].args, [[
      fakeMe.validated,
      [
        mockUser.this,
        mockUser.this,
        mockUser.this,
      ],
    ]]);
    assertEquals(mockContext.lastArgs("json")[0], {
      fulfilled: [1, 2, 3],
      alreadyIn: [4],
      rejected: ["123"],
    });
  });
});
