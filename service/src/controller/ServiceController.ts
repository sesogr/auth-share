import { ConvertedService } from "../types/ConvertedService.ts";
import { ServiceRepository } from "../interfaceTypes/ServiceRepository.ts";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { Context } from "@hono/hono";
import { Service } from "../classes/Service.ts";
import { ServiceCredential } from "../classes/ServiceCredential.ts";

export class ServiceController {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly userRepo: UserRepository,
  ) {}
  private readonly ME = "15ed8f0d-f3c3-4e6c-84dc-c2c0824741be"; //Todo with meaningfull?!

  async listMyServices(
    c: Context,
  ) {
    try {
      const serviceList = await this.serviceRepository.findOwnedByUserId(
        this.ME,
      );
      const convertedList: ConvertedService[] = serviceList.map((e) =>
        e.toJson()
      );
      return c.json(convertedList);
    } catch (e) {
      console.log(e);
      return c.json({ error: "no data", details: e });
    }
  }
  async add(c: Context) {
    try {
      const convertedService: ConvertedService = await c.req!.json!();
      const service = Service.createService(
        ServiceCredential.fromString(convertedService.credentials),
        convertedService.serviceName,
        (await this.userRepo.findById(
          this.ME,
        )).convertToShort(),
      ); //Todo: new = new type(arguments);, convertedService.serviceName)
      await this.serviceRepository.save(service);
      return c.body!(null, 201);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return c.json!({
          error: "Fehler beim Speichern des Services",
          message: error.message,
          name: error.name,
          cause: error.cause,
        });
      }
    }
  }
}
