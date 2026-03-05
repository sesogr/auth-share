import { assertIsStringRecord } from "./types.ts";

export type ConvertedGroup = {
  groupname?: string;
  owner?: string;
} & { [k in GroupListProperties]?: string[] };

type GroupListProperties =
  | "users"
  | "serviceList"
  | "sentInvitations"
  | "serviceInvitations";

export function ensureConvertedGroupIntegrity<
  K extends keyof ConvertedGroup = never,
>(
  obj: unknown,
  assertion?: K[] | K,
): asserts obj is [K] extends [never]
  ? { [P in keyof ConvertedGroup]-?: Exclude<ConvertedGroup[P], undefined> }
  : ConvertedGroup & { [P in K]-?: Exclude<ConvertedGroup[P], undefined> } {
  assertIsStringRecord(obj);

  if (assertion && typeof assertion === "string") {
    if (
      (obj as Record<string, unknown>)[assertion] === undefined ||
      (obj as Record<string, unknown>)[assertion] === null
    ) {
      throw new TypeError(`Missing property: ${assertion}`);
    }
  } else if (Array.isArray(assertion)) {
    for (const prop of assertion) {
      if (
        (obj as Record<string, unknown>)[prop] === undefined ||
        (obj as Record<string, unknown>)[prop] === null
      ) {
        throw new TypeError(`Missing property: ${prop}`);
      }
    }
  }

  if (!assertion) {
    const requiredProperties: (keyof ConvertedGroup)[] = [
      "groupname",
      "owner",
      "users",
      "serviceList",
      "sentInvitations",
      "serviceInvitations",
    ];
    for (const prop of requiredProperties) {
      if (
        (obj as Record<string, unknown>)[prop] === undefined ||
        (obj as Record<string, unknown>)[prop] === null
      ) {
        throw new TypeError(`Missing property: ${prop}`);
      }
    }
  }
}
