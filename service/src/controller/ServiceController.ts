import { ConvertedService } from "../types/ConvertedService.ts";
import { ServiceRepository } from "../interfaceTypes/ServiceRepository.ts";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { Context } from "@hono/hono";
//
export class ServiceController {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly userRepo: UserRepository,
  ) {}
  async listMyServices(
    c: Context,
  ) {
    try {
      const user = await this.userRepo.findAll();
      const serviceList = await this.serviceRepository.findOwnedByUserId(
        user[9].getId(),
      );
      const convertedList: ConvertedService[] = serviceList.map((e) =>
        e.toJson()
      );
      return c.json(convertedList);
    } catch (_e) {
      return c.json({ error: "no data" });
    }
  }
}
