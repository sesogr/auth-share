import { Environment } from "../src/classes/Environment.ts";
import { assertEquals, assertThrows } from "@std/assert";
import { EnvError } from "../src/errors/EnvError.ts";

Deno.test("Environment variables should be loaded correctly", () => {
  const environmental = Object.keys(Environment).filter((key) => {
    const hasUnderscore = key.startsWith("_");
    return hasUnderscore;
  }).map((key) => {
    return key.replace("_", "");
  });
  environmental.forEach((variable) => {
    Deno.env.set(variable, `test_${variable.toLowerCase()}`);
  });
  // Load environment variables
  Environment.load();

  // Assert that the environment variables are loaded correctly
  environmental.forEach((variable) => {
    const expectedValue = `test_${variable.toLowerCase()}`;
    const actualValue = Environment[variable as keyof Environment];
    assertEquals(
      actualValue,
      expectedValue,
      `Expected ${variable} to be ${expectedValue}, but got ${actualValue}`,
    );
  });
  environmental.forEach((variable) => {
    testcase(variable);
  });
  environmental.forEach((variable) => {
    Deno.env.delete(variable);
  });
  function testcase(casename: string) {
    Deno.env.delete(casename);
    assertThrows(
      () => {
        Environment.load();
      },
      EnvError,
      casename,
    );
    Deno.env.set(casename, "test_value");
  }
});
