import { assertThrows } from "@std/assert";
import { User } from "../src/classes/User.ts";
import { UserCredential } from "../src/classes/UserCredential.ts";
Deno.test("UserClass", async (t) => {
  await t.step("name to long error", () => {
    assertThrows(() => {
      User.createUser(
        new UserCredential("", "", ""),
        "i'mwayyyyytoolongandhave$pecialcharactersasmyname",
      );
    });
  });
});
