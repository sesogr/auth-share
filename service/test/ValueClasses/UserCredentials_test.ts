import { assertEquals } from "@std/assert";
import { stub } from "@std/testing/mock";
import { UserCredential } from "../../src/classes/UserCredential.ts";
import { bcryptAdapter } from "../../src/deps/bcryptAdapter.ts";

Deno.test("User Credential", async (t) => {
  const username = "asdkflj";
  const plainPassword = "asdfjk";

  const genSaltStub = stub(
    bcryptAdapter,
    "genSalt",
    () => Promise.resolve("salt"),
  );
  let a = true;
  const hashStub = stub(
    bcryptAdapter,
    "hash",
    () => {
      const ret = a ? Promise.resolve("hash") : Promise.resolve("hashb");
      a = false;
      return ret;
    },
  );
  const compareStub = stub(
    bcryptAdapter,
    "compare",
    () => Promise.resolve(true),
  );

  const userCred = await UserCredential.create(username, plainPassword);
  try {
    await t.step("creation", () => {
      assertEquals(userCred.username, username);
      assertEquals(userCred.hash, "hash");
      assertEquals(userCred.salt, "salt");
    });

    await t.step("verifyPasswordHash", async () => {
      await userCred.verifyPasswordHash("pw");
    });

    await t.step("changePassword", async () => {
      const newCred = await userCred.changePassword("123");
      assertEquals(newCred.hash, "hashb");
      const latestCall = hashStub.calls.length - 1;
      assertEquals(hashStub.calls[latestCall].args[0], "123");
      assertEquals(hashStub.calls[latestCall].args[1], userCred.salt);
    });
  } finally {
    genSaltStub.restore();
    hashStub.restore();
    compareStub.restore();
  }
});
