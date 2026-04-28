import { assertEquals, assertThrows } from "@std/assert";
import { Environment } from "../src/classes/Environment.ts";
import { EnvError } from "../src/classes/errors/EnvError.ts";
import { RamOnlyLog } from "./RamOnlyLog.ts";

const ENV_KEYS = [
  "FRONT_END_URL",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DENO_ENV",
] as const;

function snapshotEnv(): Record<(typeof ENV_KEYS)[number], string | undefined> {
  return Object.fromEntries(
    ENV_KEYS.map((key) => [key, Deno.env.get(key)]),
  ) as Record<(typeof ENV_KEYS)[number], string | undefined>;
}

function restoreEnv(
  snapshot: Record<(typeof ENV_KEYS)[number], string | undefined>,
) {
  for (const key of ENV_KEYS) {
    const value = snapshot[key];
    if (value === undefined) {
      Deno.env.delete(key);
    } else {
      Deno.env.set(key, value);
    }
  }
}

Deno.test("Environment", async (t) => {
  const oldEnv = snapshotEnv();
  await t.step(
    "allows setting and getting environment values manually",
    () => {
      Environment.clear();
      Environment.logger = new RamOnlyLog();
      Environment.FRONT_END_URL = "http://localhost:5173";
      Environment.DB_NAME = "auth_share";
      Environment.DB_USER = "test_user";
      Environment.DB_PASSWORD = "test_password";
      Environment.DB_HOST = "localhost";
      Environment.DENO_ENV = "test";

      assertEquals(Environment.FRONT_END_URL, "http://localhost:5173");
      assertEquals(Environment.DB_NAME, "auth_share");
      assertEquals(Environment.DB_USER, "test_user");
      assertEquals(Environment.DB_PASSWORD, "test_password");
      assertEquals(Environment.DB_HOST, "localhost");
      assertEquals(Environment.DENO_ENV, "test");
    },
  );

  await t.step("throws EnvError after clear when values are missing", () => {
    Environment.clear();
    ENV_KEYS.forEach((key) => {
      assertThrows(
        () => Environment[key],
        EnvError,
      );
    });
  });

  await t.step("loads environment values from Deno.env", () => {
    Environment.clear();

    Deno.env.set("FRONT_END_URL", "https://example.test");
    Deno.env.set("DB_NAME", "loaded_db");
    Deno.env.set("DB_USER", "loaded_user");
    Deno.env.set("DB_PASSWORD", "loaded_password");
    Deno.env.set("DB_HOST", "loaded_host");
    Deno.env.set("DENO_ENV", "test");

    Environment.load(new RamOnlyLog());

    assertEquals(Environment.FRONT_END_URL, "https://example.test");
    assertEquals(Environment.DB_NAME, "loaded_db");
    assertEquals(Environment.DB_USER, "loaded_user");
    assertEquals(Environment.DB_PASSWORD, "loaded_password");
    assertEquals(Environment.DB_HOST, "loaded_host");
    assertEquals(Environment.DENO_ENV, "test");
  });

  await t.step(
    "throws EnvError when loading with a missing environment value",
    () => {
      Environment.clear();

      Deno.env.set("FRONT_END_URL", "https://example.test");
      Deno.env.set("DB_NAME", "loaded_db");
      Deno.env.set("DB_USER", "loaded_user");
      Deno.env.set("DB_PASSWORD", "loaded_password");
      Deno.env.delete("DB_HOST");
      Deno.env.set("DENO_ENV", "test");

      assertThrows(
        () => Environment.load(new RamOnlyLog()),
        EnvError,
      );
    },
  );

  Environment.clear();
  restoreEnv(oldEnv);
});
