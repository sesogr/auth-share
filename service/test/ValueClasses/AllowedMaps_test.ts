import { assert, assertEquals, assertFalse } from "@std/assert";
import { AllowedGroupServiceMap } from "../../src/classes/AllowedGroupServiceMap.ts";
import { IdNameMap } from "../../src/classes/IdNameMap.ts";
import { AllowedUserGroupMap } from "../../src/classes/AllowedUserGroupMap.ts";
import { AllowedUserServiceMap } from "../../src/classes/AllowedUserServiceMap.ts";

Deno.test("AllowedMaps", async (t) => {
  const leftside = new IdNameMap(
    "1",
    "leftside",
  );
  const rightside = new IdNameMap("2", "rightside");
  await t.step("GroupService", () => {
    const map = new AllowedGroupServiceMap(leftside, rightside);
    assertEquals(map.getGroupname, "leftside");
    assertEquals(map.getGroupId, "1");
    assertEquals(map.getServicename, "rightside");
    assertEquals(map.getServiceId, "2");
    assertEquals(map.toString(), "1:2");
    assert(map.equals(map.copy()));
    assertEquals(map.with({ "groupRef": rightside }).getGroupId, "2");
  });
  await t.step("UserGroup", () => {
    const map = new AllowedUserGroupMap(leftside, rightside, true);
    assertEquals(map.getUsername, "leftside");
    assertEquals(map.getUserId, "1");
    assertEquals(map.getGroupname, "rightside");
    assertEquals(map.getGroupId, "2");
    assertEquals(map.toString(), "1:2:true");
    assert(map.isOwner);
    assertFalse(map.with({ "isOwner": false }).isOwner);
    assert(map.equals(map.copy()));
    assertEquals(map.with({ "groupRef": leftside }).getGroupId, "1");
  });
  await t.step("UserService", () => {
    const map = new AllowedUserServiceMap(leftside, rightside, true);
    assertEquals(map.getUsername, "leftside");
    assertEquals(map.getUserId, "1");
    assertEquals(map.getServicename, "rightside");
    assertEquals(map.getServiceId, "2");
    assertEquals(map.toString(), "1:2:true");
    assert(map.isOwner);
    assertFalse(map.with({ "isOwner": false }).isOwner);
    assert(map.equals(map.copy()));
    assertEquals(map.with({ "serviceRef": leftside }).getServiceId, "1");
  });
});
