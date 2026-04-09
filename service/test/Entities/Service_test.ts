import { assertArrayIncludes, assertEquals, assertFalse } from "@std/assert";
import { Service } from "../../src/classes/Entities/Service.ts";
import { ServiceCredential } from "../../src/classes/Values/ServiceCredential.ts";
import { FakeObjectGen } from "../../src/classes/FakeObjectGen.ts";
import { Invitation } from "../../src/classes/Values/Invitation.ts";
import { Group } from "../../src/classes/Entities/Group.ts";
import { IdNameMap } from "../../src/classes/Values/IdNameMap.ts";
import { AllowedGroupServiceMap } from "../../src/classes/Values/AllowedGroupServiceMap.ts";
import { AllowedUserServiceMap } from "../../src/classes/Values/AllowedUserServiceMap.ts";
import { ConvertedService } from "../../src/types/ConvertedService.ts";
import { ValidatedUser } from "../../src/classes/Entities/User.ts";

const serviceCredential = new ServiceCredential("", "");
const userShort = await FakeObjectGen.createFakeUser(
  undefined,
  undefined,
  "uwe",
);
const user2Short = await FakeObjectGen.createFakeUser(
  undefined,
  undefined,
  "swe",
);
const user = await FakeObjectGen.createFakeUser();
const user2 = await FakeObjectGen.createFakeUser();
const service = Service.createService(
  serviceCredential,
  "sag",
  "asdf",
  userShort,
);
Deno.test("Service Class", async (t) => {
  await t.step("Service Creates", () => {
    const owners: string[] = service.listAllowedUsers(true);
    assertArrayIncludes(owners, [userShort.getDisplayName()]);
    assertEquals(service.serviceUrl, "asdf");
    assertEquals(service.credentials, serviceCredential);
  });

  await t.step("lists that should be empty are empty", () => {
    assertEquals(
      service.listAllowedGroups().length +
        service.listAllowedUsers().length - 1,
      0,
    );
  });

  await t.step(
    "Service Authorize new User successfully puts User into owners",
    () => {
      service.giveAuthorizationToUser(user2Short);
      assertArrayIncludes(service.listAllowedUsers(), [
        user2Short.getDisplayName(),
      ]);
    },
  );
  await t.step("send invitation", () => {
    const testInvite = new Invitation(
      user.convertToShort(),
      service.convertToShort(),
      user2.convertToShort(),
      "service",
    );
    service.sendInvitation(user2 as unknown as Group, user);
    assertFalse(!service.sentInvitations.some((e) => e.equals(testInvite)));
  });

  await t.step("group authorization", () => {
    const fakeGroup = {
      convertToShort: () => {
        return { displayname: "ha" } as IdNameMap;
      },
    } as Group;
    service.giveAuthorizationToGroup(fakeGroup);
    assertEquals(
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
    service.checkOwner({ getId: () => "bcd" } as ValidatedUser);
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
