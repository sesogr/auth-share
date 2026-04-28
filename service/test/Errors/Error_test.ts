import { assertEquals, assertThrows } from "@std/assert";
import { DuplicateError } from "../../src/classes/errors/DuplicateError.ts";
import { EnvError } from "../../src/classes/errors/EnvError.ts";
import { NameTooLongError } from "../../src/classes/errors/NameTooLongError.ts";
import { NotFoundError } from "../../src/classes/errors/NotFoundError.ts";
import { RuntimeError } from "../../src/classes/errors/RuntimeError.ts";
import { ValidationError } from "../../src/classes/errors/ValidationError.ts";
import { ControllerError } from "../../src/classes/errors/controllerErrors/ControllerError.ts";
import { AuthorizationError } from "../../src/classes/errors/controllerErrors/AuthorizationError.ts";
import { FormlessError } from "../../src/classes/errors/controllerErrors/FormlessError.ts";
import { MissingDataError } from "../../src/classes/errors/controllerErrors/MissingDataError.ts";
import { SessionError } from "../../src/classes/errors/controllerErrors/SessionError.ts";
import { ConflictError } from "../../src/classes/errors/controllerErrors/ConflictError/ConflictError.ts";
import { AlreadyTakenError } from "../../src/classes/errors/controllerErrors/ConflictError/AlreadyTakenError.ts";
import {
  WrongInvitationTypeError,
} from "../../src/classes/errors/controllerErrors/ConflictError/WrongInvitationTypeError.ts";

Deno.test("Testing for all Errors", async (t) => {
  const message = "message";
  await t.step("Base Errors that dont alter message", () => {
    const errors: Error[] = [];
    errors.push(
      new DuplicateError(message),
      new NameTooLongError(message),
      new RuntimeError(message),
      new ValidationError(message),
    );
    errors.forEach((error) => {
      assertThrows(
        () => {
          throw error;
        },
        Error,
        message,
      );
    });
  });
  await t.step("Errors that alter message", () => {
    assertThrows(
      () => {
        throw new EnvError("envVar", message);
      },
      Error,
      "Environment variable envVar is not defined",
    );
    assertThrows(
      () => {
        throw new NotFoundError("target", "by", "key");
      },
      Error,
      "target, not found with by: key",
    );
  });
  await t.step("Controller Errors", () => {
    assertThrows(
      () => {
        const controllerError = new ControllerError(message, 400);
        assertEquals(controllerError.errorCode, 400);
        throw controllerError;
      },
      Error,
      message,
    );
    assertThrows(
      () => {
        const authorizationError = new AuthorizationError(message);
        assertEquals(authorizationError.errorCode, 401);
        throw authorizationError;
      },
      ControllerError,
      message,
    );
    assertThrows(
      () => {
        const formlessError = new FormlessError(message);
        assertEquals(formlessError.errorCode, 400);
        throw formlessError;
      },
      ControllerError,
      message,
    );
    assertThrows(
      () => {
        const missingDataError = new MissingDataError(message);
        assertEquals(missingDataError.errorCode, 400);
        throw missingDataError;
      },
      ControllerError,
      message,
    );
    assertThrows(
      () => {
        const sessionError = new SessionError(message);
        assertEquals(sessionError.errorCode, 401);
        throw sessionError;
      },
      ControllerError,
      message,
    );
  });
  await t.step("Conflict Errors", () => {
    assertThrows(
      () => {
        const conflictError = new ConflictError(message);
        assertEquals(conflictError.errorCode, 409);
        throw conflictError;
      },
      ControllerError,
      message,
    );
    assertThrows(
      () => {
        const alreadyTakenError = new AlreadyTakenError(message, "type");
        assertEquals(alreadyTakenError.errorCode, 409);
        assertEquals(alreadyTakenError.type, "type");
        throw alreadyTakenError;
      },
      ConflictError,
      message,
    );
    assertThrows(
      () => {
        const wrongInvitationTypeError = new WrongInvitationTypeError(message);
        assertEquals(wrongInvitationTypeError.errorCode, 409);
        throw wrongInvitationTypeError;
      },
      ConflictError,
      message,
    );
  });
});
