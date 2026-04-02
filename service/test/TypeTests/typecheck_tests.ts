import { assertThrows } from "@std/assert";
import { checkForAdditionalKeys } from "../../src/types/types.ts";
import { FormlessError } from "../../src/classes/errors/controllerErrors/FormlessError.ts";

Deno.test("Typechecks", async (t) => {
  await t.step("checkForAdditionalKeys", async (st) => {
    await st.step("approved", () => {
      const testValue = { hallo: { hallo2: "welt" } };
      const allKeys = ["hallo", "asdf"];
      checkForAdditionalKeys(testValue, allKeys);
    });
    await st.step("throws", () => {
      const testValue = { hallo: { hallo2: "welt" }, hallo3: "asdf" };
      const allKeys = ["hallo", "asd"];
      assertThrows(
        () => checkForAdditionalKeys(testValue, allKeys),
        FormlessError,
      );
    });
  });
});
