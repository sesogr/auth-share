import { HeadController } from "../../src/controller/HeadController.ts";
import { UserRepository } from "../../src/interfaceTypes/UserRepository.ts";
import { User } from "../../src/classes/User.ts";
import { Context } from "@hono/hono";
import { stub } from "@std/testing/mock";
import { HonoCookieAdapter } from "../../src/deps/HonoCookieAdapter.ts";
import { assertEquals } from "@std/assert";

class unprotectHeadController extends HeadController {
  unprotectGetMeFromContext(c: Context): Promise<User> {
    return this.getMeFromContext(c);
  }
}
type Args = {
  getcookie: [{
    1: Context;
    2: string;
  }];
  validateSession: [{ 1: string }];
};
Deno.test("HeadController", async (t) => {
  const args: Args = { getcookie: [], validateSession: [] } as unknown as Args;
  const c: Context = {} as Context;
  const user: User = {
    validateSession: (sessionToken: string) => {
      args.validateSession.push({ 1: sessionToken });
    },
  } as unknown as User;
  const userRepo: UserRepository = {
    findBySessionToken: () => Promise.resolve(user),
  } as unknown as UserRepository;

  stub(HonoCookieAdapter, "getCookie", (c, f) => {
    args.getcookie.push({ 1: c, 2: f });
    return "123";
  });
  await t.step("getMeFromContext", async () => {
    const headController = new unprotectHeadController(userRepo);
    const me: User = await headController.unprotectGetMeFromContext(c);
    assertEquals(args.getcookie[0], { 1: c, 2: "session" });
    assertEquals(args.validateSession[0], { 1: "123" });
    assertEquals(me, user);
  });
});
