import {
  assertExists,
  assertThrows,
} from "https://deno.land/std@0.104.0/testing/asserts.ts";
import DatabaseFacade from "../src/classes/DatabaseFacade.ts";

Deno.test({
  name: "connection",
  fn() {
    assertThrows(() => new DatabaseFacade());
  },
});
