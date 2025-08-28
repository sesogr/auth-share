import { assertThrows } from "https://deno.land/std@0.224.0/assert/assert_throws.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { User } from "../src/classes/User.ts";
import { UserCredential } from "../src/classes/UserCredential.ts";

Deno.test({
  name: "Length of characters",
  fn() {
    assertThrows(() => {
      User.createUser(
        new UserCredential("", ""),
        "i'mtoolongandhave$pecialcharacters"
      );
    });
  },
});
