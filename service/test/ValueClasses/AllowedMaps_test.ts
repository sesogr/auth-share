import { assert, assertEquals, assertFalse } from "@std/assert";
import { AllowedGroupServiceMap } from "../../src/classes/Values/AllowedGroupServiceMap.ts";
import { IdNameMap } from "../../src/classes/Values/IdNameMap.ts";
import { AllowedUserGroupMap } from "../../src/classes/Values/AllowedUserGroupMap.ts";
import { AllowedUserServiceMap } from "../../src/classes/Values/AllowedUserServiceMap.ts";

Deno.test("AllowedMaps", async (t) => {
  const leftSide = new IdNameMap(
    "1",
    "leftSide",
  );
  const rightSide = new IdNameMap("2", "rightSide");
  await t.step("GroupService", () => {
    const map = new AllowedGroupServiceMap(leftSide, rightSide);
    assertEquals(map.getGroupname, "leftSide");
    assertEquals(map.getGroupId, "1");
    assertEquals(map.getServicename, "rightSide");
    assertEquals(map.getServiceId, "2");
    assertEquals(map.toString(), "1:2");
    assert(map.equals(map.copy()));
    assertEquals(map.with({ "groupRef": rightSide }).getGroupId, "2");
  });
  await t.step("UserGroup", () => {
    const map = new AllowedUserGroupMap(leftSide, rightSide, true);
    assertEquals(map.getUsername, "leftSide");
    assertEquals(map.getUserId, "1");
    assertEquals(map.getGroupname, "rightSide");
    assertEquals(map.getGroupId, "2");
    assertEquals(map.toString(), "1:2:true");
    assert(map.isOwner);
    assertFalse(map.with({ "isOwner": false }).isOwner);
    assert(map.equals(map.copy()));
    assertEquals(map.with({ "groupRef": leftSide }).getGroupId, "1");
  });
  await t.step("UserService", () => {
    const map = new AllowedUserServiceMap(leftSide, rightSide, true);
    assertEquals(map.getUsername, "leftSide");
    assertEquals(map.getUserId, "1");
    assertEquals(map.getServicename, "rightSide");
    assertEquals(map.getServiceId, "2");
    assertEquals(map.toString(), "1:2:true");
    assert(map.isOwner);
    assertFalse(map.with({ "isOwner": false }).isOwner);
    assert(map.equals(map.copy()));
    assertEquals(map.with({ "serviceRef": leftSide }).getServiceId, "1");
  });
});
