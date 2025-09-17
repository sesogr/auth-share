import { Context } from "@hono/hono";

export const userController = (c: Context) => {
  //const convertedList: ConvertedUser[] = userList.map((e) => e.toJson());
  return c; //.json();//convertedList);
};
