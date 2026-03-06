import { MissingDataError } from "../errors/controllerErrors/MissingDataError.ts";
import {
  assertIsStringRecord,
  checkForAdditionalKeys,
  FilterForValues,
  indepthTypeCheck,
} from "./types.ts";

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
  const stringKeys: FilterForValues<ConvertedGroup, string | undefined>[] = [
    "groupname",
    "owner",
  ];
  const stringArrayKeys: FilterForValues<
    ConvertedGroup,
    string[] | undefined
  >[] = ["sentInvitations", "serviceInvitations", "serviceList", "users"];
  const allKeys: (keyof ConvertedGroup)[] = [...stringKeys, ...stringArrayKeys];
  checkForAdditionalKeys(obj, allKeys);
  if (assertion) indepthTypeCheck(assertion, stringKeys, obj, stringArrayKeys);
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
        throw new MissingDataError(`Missing property: ${prop}`);
      }
    }
  }
}
