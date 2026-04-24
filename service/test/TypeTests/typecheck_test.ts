import { assertThrows } from "@std/assert";
import { checkForAdditionalKeys, typeCheck } from "../../src/types/types.ts";
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
  await t.step("Type Check", async (st) => {
    await st.step("array", async (sst) => {
      await sst.step("is", () => {
        typeCheck({ array: ["ads"] }, "array", "array");
      });
      await sst.step("is not", () => {
        assertThrows(
          () => {
            const testValue: Record<string, unknown> = { array: "fg" };
            typeCheck(testValue, "array", "array");
          },
          TypeError,
          "array",
        );
      });
    });

    await st.step("object", async (sst) => {
      await sst.step("is not", () => {
        assertThrows(
          () => {
            const testValue: Record<string, unknown> = { object: "fg" };
            typeCheck(testValue, "object", "object");
          },
          TypeError,
          "object",
        );
      });
      await sst.step("is", () => {
        typeCheck({ object: { sdf: "asdk" } }, "object", "object");
      });
    });

    await st.step("string", async (sst) => {
      await sst.step("is not", () => {
        assertThrows(
          () => {
            const testValue: Record<string, unknown> = { string: 12 };
            typeCheck(testValue, "string");
          },
          TypeError,
          "string",
        );
      });
      await sst.step("is", () => {
        typeCheck({ string: "string" }, "string");
      });
    });

    await st.step("number", async (sst) => {
      await sst.step("is not", () => {
        assertThrows(
          () => {
            const testValue: Record<string, unknown> = { number: "fg" };
            typeCheck(testValue, "number", "number");
          },
          TypeError,
          "number",
        );
      });
      await sst.step("is", () => {
        typeCheck({ number: 123 }, "number", "number");
      });
    });

    await st.step("boolean", async (sst) => {
      await sst.step("is not", () => {
        assertThrows(
          () => {
            const testValue: Record<string, unknown> = { boolean: "fg" };
            typeCheck(testValue, "boolean", "boolean");
          },
          TypeError,
          "boolean",
        );
      });
      await sst.step("is", () => {
        typeCheck({ boolean: true }, "boolean", "boolean");
      });
    });
  });
});
