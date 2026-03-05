import { HeadController } from "../../src/controller/HeadController.ts";
import { User } from "../../src/classes/User.ts";
import { Context } from "@hono/hono";

class _unprotectHeadController extends HeadController {
  unprotectGetMeFromContext(
    c: Context,
  ): User {
    return this.getMeFromContext(c);
  }
}
type Args = object;
Deno.test("HeadController", async (_t) => {
});
