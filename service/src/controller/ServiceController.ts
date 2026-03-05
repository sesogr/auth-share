import {
  ConvertedService,
  ensureConvertedServiceIntegrity,
} from "../types/ConvertedService.ts";
import { ServiceRepository } from "../interfaceTypes/ServiceRepository.ts";
import { Context } from "@hono/hono";
import { Service } from "../classes/Service.ts";
import { ServiceCredential } from "../classes/ServiceCredential.ts";
import { HeadController } from "./HeadController.ts";
import { AuthorizationError } from "../errors/controllerErrors/UnauthorizedError.ts";

export class ServiceController extends HeadController {
  constructor(
    private readonly serviceRepository: ServiceRepository,
  ) {
    super();
  }

  async listMyServices(
    c: Context,
  ) {
    try {
      const ME = this.getMeFromContext(c);
      const serviceList = await this.serviceRepository.findOwnedByUserId(
        ME.getId(),
      );
      const convertedList: ConvertedService[] = serviceList.map((e) =>
        e.toJson()
      );
      return c.json(convertedList);
    } catch (error) {
      this.errorHandle(error, c);
    }
  }
  async add(c: Context) {
    try {
      const ME = this.getMeFromContext(c);
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
      this.errorHandle(error, c);
    }
  }
  async delete(c: Context) {
    try {
      const ME = this.getMeFromContext(c);
      const convertedService: ConvertedService = await c.req.json();
      ensureConvertedServiceIntegrity(convertedService);
      const service = await this.serviceRepository.findById(
        convertedService.id,
      );
      if (!service) {
        return c.json({ error: "Service not found" }, 404);
      }
      if (!service.listAllowedUsers(true).includes(ME.getDisplayName())) {
        throw new AuthorizationError(
          "You are not allowed to delete this service",
        );
      }
      await this.serviceRepository.delete(service);
      return c.body(null, 204);
    } catch (error) {
      this.errorHandle(error, c);
    }
  }
}
