import { stub } from "@std/testing/mock";
import { Session } from "../src/classes/Session.ts";
import { assertEquals } from "@std/assert";

Deno.test("Session", async (t) => {
  const dateNowStub = stub(Date, "now", () => 123);
  const compareDate = new Date(Date.now() + Session.MAX_DURATION_MS);
  await t.step("create", () => {
    const session = Session.create("123", "test");
    assertEquals(
      session.id,
      "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
    );
    assertEquals(session.userId, "test");
    assertEquals(session.expiresAt, compareDate);
    assertEquals(session.id, session.toString());
    assertEquals(dateNowStub.calls.length, 2);
  });
  await t.step("generateRandomSessionToken", () => {
    const cryptoRandomValuesStub = stub(crypto, "getRandomValues");
    assertEquals(
      Session.generateRandomSessionToken(),
      "AAAAAAAAAAAAAAAAAAAAAAAAAAA=",
    );
    assertEquals(cryptoRandomValuesStub.calls.length, 1);
  });
});
