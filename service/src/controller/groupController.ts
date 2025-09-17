import { Context } from "@hono/hono";

export const groupController = (c: Context) => {
  //  const convertedGroupList: ConvertedGroup[] = testGroup.map((e) => e.toJson());
  return c; //.json(convertedGroupList);
};
