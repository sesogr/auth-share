import { ConvertedGroup } from "./ConvertedGroup.ts";
import { ConvertedService } from "./ConvertedService.ts";
import { ConvertedUser } from "./ConvertedUser.ts";

export type { ConvertedGroup, ConvertedService, ConvertedUser };
export function assertIsStringRecord(
  obj: unknown,
): asserts obj is Record<string, unknown> {
  if (typeof obj !== "object" || obj === null) {
    throw new TypeError("Not an object");
  }
  const objectkeys = Object.keys(obj);
  if (!(objectkeys.length > 0)) {
    throw new TypeError("Empty object");
  }
  if (!objectkeys.every((key) => typeof key === "string")) {
    throw new TypeError("All keys must be strings");
  }
}
