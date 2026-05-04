import {
  assertArrayIncludes,
  assertEquals,
  assertFalse,
  assertThrows,
} from "@std/assert";
import { OwnedService, Service } from "../../src/classes/Entities/Service.ts";
import { ServiceCredential } from "../../src/classes/Values/ServiceCredential.ts";
import { Invitation } from "../../src/classes/Values/Invitation.ts";
import { Group } from "../../src/classes/Entities/Group.ts";
import { IdNameMap } from "../../src/classes/Values/IdNameMap.ts";
import { AllowedGroupServiceMap } from "../../src/classes/Values/AllowedGroupServiceMap.ts";
import { AllowedUserServiceMap } from "../../src/classes/Values/AllowedUserServiceMap.ts";
import { ConvertedService } from "../../src/types/ConvertedService.ts";
import { User } from "../../src/classes/Entities/User.ts";
import { TestUser } from "../StubbedClasses/TestUser.ts";
import { TestGroup } from "../StubbedClasses/TestGroup.ts";
import { DuplicateError } from "../../src/classes/errors/DuplicateError.ts";
import { NotFoundError } from "../../src/classes/errors/NotFoundError.ts";
import { AuthorizationError } from "../../src/classes/errors/controllerErrors/AuthorizationError.ts";

Deno.test("Service Class", async (t) => {
  const serviceCredential = new ServiceCredential("", "");
  const ownerData = new IdNameMap("ownerId", "ownerName");
  const userData = new IdNameMap("userId", "userName");
  const senderData = new IdNameMap("senderId", "senderName");
  const receiverData = new IdNameMap("receiverId", "receiverName");
  const fakeUser = TestUser.create();
  const fakeGroup = TestGroup.create();
  fakeUser.registerOutput("convertToShort", ownerData);
  fakeUser.registerOutput("getId", ownerData.id);
  const service: OwnedService = Service.createService(
    serviceCredential,
    "sag",
    "asdf",
    fakeUser.this,
  );
  await t.step("Service Creates", () => {
    const owners: string[] = service.listAllowedUsers(true);
    assertArrayIncludes(owners, [ownerData.displayname]);
    assertEquals(service.serviceUrl, "asdf");
    assertEquals(service.credentials, serviceCredential);
  });
  await t.step("check owner throws when not an owner", () => {
    assertThrows(() => {
      service.checkOwner(fakeUser.this);
    }, AuthorizationError);
  });
  await t.step("lists that should be empty are empty", () => {
    assertEquals(
      service.listAllowedGroups().length +
        service.listAllowedUsers().length - 1,
      0,
    );
  });

  await t.step(
    "give Authorization to User",
    async (st) => {
      await st.step("works", () => {
        fakeUser.registerOutput("convertToShort", userData);
        service.giveAuthorizationToUser(fakeUser.this);
        assertArrayIncludes(service.listAllowedUsers(), [
          userData.displayname,
        ]);
      });
      await st.step("throws when already given", () => {
        fakeUser.registerOutput("convertToShort", userData);
        assertThrows(
          () => {
            service.giveAuthorizationToUser(fakeUser.this);
          },
          DuplicateError,
          userData.displayname,
        );
      });
    },
  );
  await t.step("promote user", async (st) => {
    await st.step("NotFound throws", () => {
      assertThrows(
        () => {
          service.promoteUser("error");
        },
        NotFoundError,
      );
    });
    await st.step("Duplicate throws", () => {
      assertThrows(
        () => {
          service.promoteUser(ownerData.displayname);
        },
        DuplicateError,
      );
    });
    await st.step("worked", () => {
      service.promoteUser(userData.displayname);
      assertArrayIncludes(service.listAllowedUsers(), [
        ownerData.displayname,
        userData.displayname,
      ]);
    });
  });
  await t.step("send invitation", async (st) => {
    fakeUser.registerOutput("convertToShort", senderData);
    fakeGroup.registerOutput("convertToShort", receiverData);
    fakeUser.registerOutput("convertToShort", senderData);
    fakeGroup.registerOutput("convertToShort", receiverData);
    const testInvite = new Invitation(
      senderData,
      service.convertToShort(),
      receiverData,
      "service",
    );
    await st.step("worked", () => {
      service.sendInvitation(fakeGroup.this, fakeUser.this);
      assertFalse(!service.sentInvitations.some((e) => e.equals(testInvite)));
    });
    await st.step("already send", () => {
      assertThrows(() => {
        service.sendInvitation(fakeGroup.this, fakeUser.this);
      }, DuplicateError);
    });
  });
  await t.step("accept invitation", async (st) => {
    const testInvite = new Invitation(
      senderData,
      service.convertToShort(),
      receiverData,
      "service",
    );
    await st.step("worked", () => {
      service.acceptInvitation(testInvite);
      assertArrayIncludes(service.listAllowedGroups(), [
        receiverData.displayname,
      ]);
    });
    await st.step("not found", () => {
      assertThrows(() => {
        service.acceptInvitation({} as Invitation);
      }, NotFoundError);
    });
  });
  await t.step("group authorization", () => {
    const fakeGroup = {
      convertToShort: () => {
        return { displayname: "ha" } as IdNameMap;
      },
    } as Group;
    service.giveAuthorizationToGroup(fakeGroup);
    assertArrayIncludes(
      service.listAllowedGroups(),
      [fakeGroup.convertToShort().displayname],
    );
  });

  await t.step("show all", () => {
    const service: Service = new Service(
      { username: "ha", password: "ha" } as ServiceCredential,
      "abc",
      "asd",
      "adc",
      [{ toString: () => "adjf" }] as Invitation[],
      [{
        getUserId: "bcd",
        getUsername: "asd",
        isOwner: true,
      }, {
        getUsername: "asdc",
        isOwner: false,
      }] as AllowedUserServiceMap[],
      [{
        getGroupname: "asd",
      }] as AllowedGroupServiceMap[],
    );
    service.checkOwner({ getId: () => "bcd" } as User);
    const data: ConvertedService = {
      credentials: {
        username: service.credentials.username!,
        password: service.credentials.password!,
      },
      serviceName: service.getDisplayName(),
      serviceUrl: service.serviceUrl,
      groups: service.listAllowedGroups(),
      users: service.listAllowedUsers(),
      owners: service.listAllowedUsers(true),
      sentInvitations: service.sentInvitations.map((e) => e.toString()),
      id: service.getId(),
    };
    assertEquals(service.toJson(), data);
    assertEquals(service.toJsonString(), JSON.stringify(data));
  });
  await t.step("show all restricted", () => {
    const service: Service = new Service(
      { username: "ha", password: "ha" } as ServiceCredential,
      "abc",
      "asd",
      "adc",
      [{ toString: () => "adjf" }] as Invitation[],
      [{
        getUserId: "bcd",
        getUsername: "asd",
        isOwner: true,
      }, {
        getUsername: "asdc",
        isOwner: false,
      }] as AllowedUserServiceMap[],
      [{
        getGroupname: "asd",
      }] as AllowedGroupServiceMap[],
    );
    const data: ConvertedService = {
      credentials: {
        username: service.credentials.username!,
        password: service.credentials.password!,
      },
      serviceName: service.getDisplayName(),
      serviceUrl: service.serviceUrl,
      id: service.getId(),
    };
    assertEquals(service.toJson(), data);
    assertEquals(service.toJsonString(), JSON.stringify(data));
  });
});
