import { Context } from "@hono/hono";
import { firstUser, serviceRepository } from "../main.ts";
import { ConvertedService } from "../types/ConvertedService.ts";

export const serviceController = (c: Context) => {
  const serviceList = serviceRepository.findOwnedByUserName(
    firstUser.getDisplayName(),
  );
  const convertedList: ConvertedService[] = serviceList.map((e) => e.toJson());
  return c.json(convertedList);
};
