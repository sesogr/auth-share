import {
  ConvertedService,
  ensureConvertedServiceIntegrity,
} from "../types/ConvertedService.ts";
import { ServiceRepository } from "../interfaceTypes/ServiceRepository.ts";
import { Context } from "@hono/hono";
import { Service } from "../classes/Service.ts";
import { ServiceCredential } from "../classes/ServiceCredential.ts";
import { HeadController } from "./HeadController.ts";
import { AuthorizationError } from "../errors/controllerErrors/AuthorizationError.ts";
import { UserRepository } from "../interfaceTypes/UserRepository.ts";
import { User } from "../classes/User.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";
import { PromisesUtil } from "../services/PromissesUtil.ts";
import { ItemAlreadyExistsError } from "../errors/ItemAlreadyExistsError.ts";
import { ConvertedUser } from "../types/types.ts";

export class ServiceController extends HeadController {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly userRepository: UserRepository,
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
  async addUsersToService(c: Context) {
    try {
      const ME = this.getMeFromContext(c);
      const serviceData: ConvertedService = await c.req.json();
      ensureConvertedServiceIntegrity(serviceData, ["id", "users"]);
      const service: Service = await this.serviceRepository.findById(
        serviceData.id,
      );
      service.checkOwner(ME);
      const settledRecords: PromiseSettledResult<User>[] = await Promise
        .allSettled(
          serviceData.users.map((e) =>
            this.userRepository.findByDisplayName(e)
          ),
        );
      const { fullfilled: users, rejected: notfound } = PromisesUtil
        .splitSettled<
          User,
          NotFoundError
        >(settledRecords);
      const alreadyAuthorized: ConvertedUser[] = [];
      const fullfilledUsers: ConvertedUser[] = [];
      users.forEach((u) => {
        try {
          service.giveAuthorizationToUser(u);
          fullfilledUsers.push(u.toJson());
        } catch (error) {
          if (error instanceof ItemAlreadyExistsError) {
            alreadyAuthorized.push(u.toJson());
          }
        }
      });
      await this.serviceRepository.save(service);
      return c.json({
        resolved: fullfilledUsers,
        alreadyIn: alreadyAuthorized,
        rejected: notfound,
      }, 200);
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }

  async delete(c: Context) {
    try {
      const ME = this.getMeFromContext(c);
      const convertedService: ConvertedService = await c.req.json();
      ensureConvertedServiceIntegrity(convertedService, "id");
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
