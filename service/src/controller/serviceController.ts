import { Context } from "@hono/hono";
import { ConvertedService } from "../types/ConvertedService.ts";
import { ServiceRepository } from "../interfaceTypes/ServiceRepository.ts";

export const serviceController =
  (serviceRepository: ServiceRepository, userId: string) => (c: Context) => {
    const serviceList = serviceRepository.findOwnedByUserId(
      userId,
    );
    const convertedList: ConvertedService[] = serviceList.map((e) =>
      e.toJson()
    );
    return c.json(convertedList);
  };
