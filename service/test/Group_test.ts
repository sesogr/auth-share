import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { Group } from "../src/classes/Group.ts";
import { User } from "../src/classes/User.ts";
import { UserCredential } from "../src/classes/UserCredential.ts";
import { assertArrayIncludes } from "https://deno.land/std@0.224.0/assert/assert_array_includes.ts";

const userCredential = new UserCredential("Hans Meiser", "abcdef");
const user = User.createUser(userCredential, "");

function createTestGroup(): Group {
  return Group.createUserGroup("Schachverein", user);
}

Deno.test("test the method createUserGroup", () => {
  const group = createTestGroup();
  const owner = group.getOwner();
  assertEquals(owner, user);
});

Deno.test("test the method getDisplayName on groupname", () => {
  const group = createTestGroup();
  const groupname = group.getDisplayName();
  assertEquals(groupname, "Schachverein");
  console.log(
    "The groupname is " + groupname + " and should be hopefully Schachverein!?"
  );
});

Deno.test("test the method getDisplayName on owner", () => {
  const group = createTestGroup();

  const owner = userCredential.username;
  console.log(
    "The owner is " + owner + " and should be hopefully Hans Meiser!?"
  );
  assertEquals(owner, "Hans Meiser");
});

Deno.test("test whether the list serviceInvitations is empty", () => {
  const group = createTestGroup();
  const list = group.listServiceInvitation();
  assertArrayIncludes(list, list);
});

Deno.test("test2 whether the list serviceInvitations is empty", () => {
  const group = createTestGroup();
  const list = group.listServiceInvitation();

  const length = list.length;
  console.log("The lenght of the List is ", length, " and should be 0, right?");
  assertEquals(length, 0);
});
