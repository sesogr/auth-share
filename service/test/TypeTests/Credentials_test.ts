import { assertThrows } from "@std/assert";
import {
  assertIsCredentials,
  Credentials,
} from "../../src/types/Credentials.ts";
import { MissingDataError } from "../../src/classes/errors/controllerErrors/MissingDataError.ts";
import { FormlessError } from "../../src/classes/errors/controllerErrors/FormlessError.ts";

Deno.test("Credentials Type Check", async (t) => {
  const testCredentials = {
    username: "username",
    password: "password",
  };
  const onlyUsernameCredentials = {
    username: "username",
  };
  const onlyPasswordCredentials = {
    password: "password",
  };
  const notanobject = "not an object";
  const wrongKeys = {
    no: "no",
  };
  const empty: Credentials = {};
  await t.step("both are needed", () => {
    assertIsCredentials(testCredentials);
    assertIsCredentials(testCredentials, "username");
    assertIsCredentials(testCredentials, "password");
    assertIsCredentials(testCredentials, ["username", "password"]);
    const _typedCredentials: { username: string; password: string } =
      testCredentials;
  });
  await t.step("only username is needed", () => {
    assertIsCredentials(onlyUsernameCredentials, "username");
    assertIsCredentials(onlyUsernameCredentials, ["username"]);
    assertThrows(
      () => {
        assertIsCredentials(onlyUsernameCredentials, "password");
      },
      MissingDataError,
      "password",
    );
    assertThrows(
      () => {
        assertIsCredentials(onlyUsernameCredentials, ["password"]);
      },
      MissingDataError,
      "password",
    );
    assertThrows(
      () => {
        assertIsCredentials(onlyUsernameCredentials, ["password", "username"]);
      },
      MissingDataError,
      "password",
    );
    const _typedCredentials: { username: string } = onlyUsernameCredentials;
  });
  await t.step("only password is needed", () => {
    assertIsCredentials(onlyPasswordCredentials, "password");
    assertIsCredentials(onlyPasswordCredentials, ["password"]);
    assertThrows(
      () => {
        assertIsCredentials(onlyPasswordCredentials, "username");
      },
      MissingDataError,
      "username",
    );
    assertThrows(
      () => {
        assertIsCredentials(onlyPasswordCredentials, ["username"]);
      },
      MissingDataError,
      "username",
    );
    assertThrows(
      () => {
        assertIsCredentials(onlyPasswordCredentials);
      },
      MissingDataError,
      "username",
    );
    assertThrows(
      () => {
        assertIsCredentials(onlyPasswordCredentials, ["username", "password"]);
      },
      MissingDataError,
      "username",
    );
    const _typedCredentials: { password: string } = onlyPasswordCredentials;
  });
  await t.step("errors related to additional keys type problems", () => {
    assertThrows(
      () => {
        assertIsCredentials(wrongKeys);
      },
      FormlessError,
      "Wrong Keys Detected",
    );
    assertThrows(
      () => {
        assertIsCredentials(empty);
      },
      TypeError,
      "Empty object",
    );
    assertThrows(
      () => {
        assertIsCredentials(notanobject);
      },
      TypeError,
      "Not an object",
    );
  });
});
