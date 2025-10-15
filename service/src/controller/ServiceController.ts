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
  async listMyServices(
    c: Context,
  ) {
    try {
      const serviceList = await this.serviceRepository.findOwnedByUserId(
        "b8e8c369-4771-4deb-8f7b-3d0ee3624fa4", //Todo with meaningfull?!
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
          "b8e8c369-4771-4deb-8f7b-3d0ee3624fa4",
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
