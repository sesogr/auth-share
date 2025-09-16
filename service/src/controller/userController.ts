import { Context } from "@hono/hono";
import { ConvertedUser } from "../types/ConvertedUser.ts";
import { userList } from "../main.ts";

export const userController = (c: Context) => {
  const convertedList: ConvertedUser[] = userList.map((e) => e.toJson());
  return c.json(convertedList);
};
