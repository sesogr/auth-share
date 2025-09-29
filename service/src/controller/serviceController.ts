import { Context } from "@hono/hono";
import { ConvertedService } from "../types/ConvertedService.ts";
import { ServiceRepository } from "../interfaceTypes/ServiceRepository.ts";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";

export const serviceController =
  (serviceRepository: ServiceRepository, userRepo: UserRepository) =>
  (c: Context) => {
    try {
      const user = userRepo.findAll();
      const serviceList = serviceRepository.findOwnedByUserId(
        user[9].getId(),
      );
      const convertedList: ConvertedService[] = serviceList.map((e) =>
        e.toJson()
      );
      return c.json(convertedList);
    } catch (_e) {
      return c.json({ error: "no data" });
    }
  };
