import { HeadController } from "../../src/classes/controller/HeadController.ts";
import { User } from "../../src/classes/Entities/User.ts";
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
