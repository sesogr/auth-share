import { Context } from "@hono/hono";
import { testGroup } from "../main.ts";
import { ConvertedGroup } from "../types/ConvertedGroup.ts";

export const groupController = (c: Context) => {
  const convertedGroupList: ConvertedGroup[] = testGroup.map((e) => e.toJson());
  return c.json(convertedGroupList);
};
