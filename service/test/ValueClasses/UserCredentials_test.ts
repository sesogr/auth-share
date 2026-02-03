import { assertEquals } from "@std/assert";
import { stub } from "@std/testing/mock";
import { UserCredential } from "../../src/classes/UserCredential.ts";
import { bcryptAdapter } from "../../src/deps/bcrypt_adapter.ts";

Deno.test("Usercredential", async (t) => {
  const username = "asdkflj";
  const plainpassword = "asdfjk";

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

  const usercred = await UserCredential.create(username, plainpassword);
  try {
    await t.step("creation", () => {
      assertEquals(usercred.username, username);
      assertEquals(usercred.hash, "hash");
      assertEquals(usercred.salt, "salt");
    });

    await t.step("verifyPasswordHash", async () => {
      const ok = await usercred.verifyPasswordHash("pw");
      assertEquals(ok, true);
    });

    await t.step("changePassword", async () => {
      const newCred = await usercred.changePassword("123");
      assertEquals(newCred.hash, "hashb");
      const latestCall = hashStub.calls.length - 1;
      assertEquals(hashStub.calls[latestCall].args[0], "123");
      assertEquals(hashStub.calls[latestCall].args[1], usercred.salt);
    });
  } finally {
    genSaltStub.restore();
    hashStub.restore();
    compareStub.restore();
  }
});
