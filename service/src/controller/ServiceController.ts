import {
  ConvertedService,
  ensureConvertedServiceIntegrity,
} from "../types/ConvertedService.ts";
import { ServiceRepository } from "../interfaceTypes/ServiceRepository.ts";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { Context } from "@hono/hono";
import { Service } from "../classes/Service.ts";
import { ServiceCredential } from "../classes/ServiceCredential.ts";
import { HeadController } from "./HeadController.ts";

export class ServiceController extends HeadController {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    userRepository: UserRepository,
  ) {
    super(userRepository);
  }

  async listMyServices(
    c: Context,
  ) {
    try {
      const ME = await this.getMeFromContext(c);
      const serviceList = await this.serviceRepository.findOwnedByUserId(
        ME.getId(),
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
      const ME = await this.getMeFromContext(c);
      const convertedService: ConvertedService = await c.req.json();
      ensureConvertedServiceIntegrity(convertedService, [
        "credentials",
        "serviceUrl",
        "serviceName",
      ]);
      const service = Service.createService(
        new ServiceCredential(
          convertedService.credentials.username,
          convertedService.credentials.password,
        ),
        convertedService.serviceName,
        convertedService.serviceUrl,
        ME,
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
  async delete(c: Context) {
    try {
      const ME = await this.getMeFromContext(c);
      const convertedService: ConvertedService = await c.req.json();
      ensureConvertedServiceIntegrity(convertedService);
      const service = await this.serviceRepository.findById(
        convertedService.id,
      );
      if (!service) {
        return c.json({ error: "Service not found" }, 404);
      }
      if (!service.listAllowedUsers(true).includes(ME.getDisplayName())) {
        return c.json({ error: "Unauthorized" }, 403);
      }
      await this.serviceRepository.delete(service);
      return c.body(null, 204);
    } catch (error) {
      console.log(error);
      return c.json({
        error: "Fehler beim Löschen des Services",
        details: error,
      }, 500);
    }
  }
}
