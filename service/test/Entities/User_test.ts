import { assertEquals, assertThrows } from "@std/assert";
import { User } from "../../src/classes/User.ts";
import { UserCredential } from "../../src/classes/UserCredential.ts";
import { stub } from "@std/testing/mock";
import { Session } from "../../src/classes/Session.ts";
Deno.test("UserClass", async (t) => {
  const [name, hash, salt, displayname] = ["as", "cd", "jd", "da"];
  const uc = new UserCredential(name, hash, salt);
  stub(Session, "create", () => new Session("asd", new Date(2027, 12), "asd"));
  stub(Session, "fromSessionTokenToSessionId", () => "asd");

  await t.step("creation", async (st) => {
    await st.step("name too long", () => {
      assertThrows(() => {
        User.createUser(
          new UserCredential("", "", ""),
          "i'mwayyyyytoolongandhave$pecialcharactersasmyname",
        );
      });
    });
    const user: User = User.createUser(
      uc,
      displayname,
    );
    await st.step("creation valid", () => {
      assertEquals(user.getCredentials(), uc);
    });
  });
  await t.step("change displayname", async (st) => {
    const user: User = User.createUser(
      new UserCredential("", "", ""),
      displayname,
    );
    await st.step("displayname too long", () => {
      assertThrows(() => {
        user.setDisplayName(
          "i'mwayyyyytoolongandhave$pecialcharactersasmyname",
        );
      });
    });
    await st.step("valid change displayname", () => {
      const newDisplayName = "newDisplayName";
      user.setDisplayName(newDisplayName);
      assertEquals(user.getDisplayName(), newDisplayName);
    });
  });
});
