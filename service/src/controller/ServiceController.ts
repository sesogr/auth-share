import { ConvertedService } from "../types/ConvertedService.ts";
import { ServiceRepository } from "../interfaceTypes/ServiceRepository.ts";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { Context } from "@hono/hono";
import { AllOptional } from "../types/AllOptional.ts";
import { Service } from "../classes/Service.ts";
import { ServiceCredential } from "../classes/ServiceCredential.ts";

export class ServiceController {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly userRepo: UserRepository,
  ) {}
  async listMyServices(
    c: AllOptional<Context>,
  ) {
    try {
      const serviceList = await this.serviceRepository.findOwnedByUserId(
        "f1504da5-8890-41a7-9023-8c3aef2f885a", //Todo with meaningfull?!
      );
      const convertedList: ConvertedService[] = serviceList.map((e) =>
        e.toJson()
      );
      return c.json!(convertedList);
    } catch (e) {
      return c.json!({ error: "no data", details: e });
    }
  }
  async add(c: AllOptional<Context>) {
    try {
      const convertedService: ConvertedService = await c.req!.json!();
      const service = Service.createService(
        ServiceCredential.fromString(convertedService.credentials),
        convertedService.serviceName,
        (await this.userRepo.findById(
          "f1504da5-8890-41a7-9023-8c3aef2f885a",
        )).convertToShort(),
      ); //Todo: new = new type(arguments);, convertedService.serviceName)
      await this.serviceRepository.save(service);
      return c.body!(null, 201);
    } catch (error) {
      console.log(error);
      return c.json!({
        error: "Fehler beim Speichern des Services",
        details: error,
      });
    }
  }
}
