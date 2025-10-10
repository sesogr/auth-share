import { ConvertedService } from "../types/ConvertedService.ts";
import { ServiceRepository } from "../interfaceTypes/ServiceRepository.ts";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { Context } from "@hono/hono";
import { AllOptional } from "../types/AllOptional.ts";

export class ServiceController {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly userRepo: UserRepository,
  ) {}
  async listMyServices(
    c: AllOptional<Context>,
  ) {
    try {
      const user = await this.userRepo.findAll();
      const serviceList = await this.serviceRepository.findOwnedByUserId(
        user[0].getId(),
      );
      const convertedList: ConvertedService[] = serviceList.map((e) =>
        e.toJson()
      );
      return c.json!(convertedList);
    } catch (e) {
      return c.json!({ error: "no data", details: e });
    }
  }
}
