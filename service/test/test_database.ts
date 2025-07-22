import {
  assertExists,
  assertThrows,
} from "https://deno.land/std@0.104.0/testing/asserts.ts";
import DBManager from "../src/classes/DBManager.ts";

Deno.test({
  name: "connection",
  fn() {
    assertThrows(() => new DBManager());
  },
});
