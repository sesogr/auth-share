import { client } from "../src/database.ts";
import { assertExists } from "https://deno.land/std@0.104.0/testing/asserts.ts";

Deno.test({
  name: "connection",
  fn() {
    assertExists(client);
  },
});
