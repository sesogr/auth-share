import { Environment } from "../src/classes/Environment.ts";
import { assertEquals, assertThrows } from "@std/assert";
import { EnvError } from "../src/classes/errors/EnvError.ts";

Deno.test("Environment variables should be loaded correctly", (_t) => {
  const testcase = (caseName: string) => {
    Deno.env.delete(caseName);
    assertThrows(
      () => {
        Environment.load();
      },
      EnvError,
      caseName,
    );
    Deno.env.set(caseName, "test_value");
  };
  const environmental = Object.keys(Environment).filter((key) => {
    return key.startsWith("_");
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
});
