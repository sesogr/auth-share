import {
  ConvertedService,
  ensureConvertedServiceIntegrity,
} from "../types/ConvertedService.ts";
import { ServiceRepository } from "../interfaceTypes/ServiceRepository.ts";
import { Context } from "@hono/hono";
import { Service } from "../classes/Service.ts";
import { ServiceCredential } from "../classes/ServiceCredential.ts";
import { HeadController } from "./HeadController.ts";
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
      );
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
      const { fulfilled: users, rejected: notfound } = PromisesUtil
        .splitSettled<
          User,
          NotFoundError
        >(settledRecords);
      const alreadyAuthorized: ConvertedUser[] = [];
      const fulfilledUsers: ConvertedUser[] = [];
      users.forEach((u) => {
        try {
          service.giveAuthorizationToUser(u);
          fulfilledUsers.push(u.toJson());
        } catch (error) {
          if (error instanceof ItemAlreadyExistsError) {
            alreadyAuthorized.push(u.toJson());
          }
        }
      });
      await this.serviceRepository.save(service);
      return c.json({
        resolved: fulfilledUsers,
        alreadyIn: alreadyAuthorized,
        rejected: notfound,
      }, 200);
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }

  async promoteUsersOfService(c: Context) {
    try {
      const ME = this.getMeFromContext(c);
      const serviceData: ConvertedService = await c.req.json();
      ensureConvertedServiceIntegrity(serviceData, ["owners", "id"]);
      const service: Service = await this.serviceRepository.findById(
        serviceData.id,
      );
      service.checkOwner(ME);
      const promotedUsers: string[] = [];
      const rejectedUsers: string[] = [];
      const alreadyIn: string[] = [];
      serviceData.owners.forEach((toPromote) => {
        try {
          service.promoteUser(toPromote);
          promotedUsers.push(toPromote);
        } catch (error) {
          if (error instanceof ItemAlreadyExistsError) {
            alreadyIn.push(toPromote);
          }
          if (error instanceof NotFoundError) {
            alreadyIn.push(toPromote);
          }
        }
      });
      await this.serviceRepository.save(service);
      return c.json({
        promoted: promotedUsers,
        alreadyIn: alreadyIn,
        rejected: rejectedUsers,
      });
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }

  async delete(c: Context) {
    try {
      const ME = this.getMeFromContext(c);
      const convertedService: ConvertedService = await c.req.json();
      ensureConvertedServiceIntegrity(convertedService, "id");
      const service: Service = await this.serviceRepository.findById(
        convertedService.id,
      );
      service.checkOwner(ME);
      await this.serviceRepository.delete(service);
      return c.body(null, 204);
    } catch (error) {
      this.errorHandle(error, c);
    }
  }
}
