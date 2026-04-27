import {
  ConvertedService,
  ensureConvertedServiceIntegrity,
} from "../../types/ConvertedService.ts";
import { ServiceRepository } from "../../../interfaceTypes/ServiceRepository.ts";
import { Context } from "@hono/hono";
import { Service } from "../Entities/Service.ts";
import { ServiceCredential } from "../Values/ServiceCredential.ts";
import { HeadController } from "./HeadController.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";
import { PromisesUtil } from "../PromissesUtil.ts";
import { AlreadyTakenError } from "../errors/controllerErrors/ConflictError/AlreadyTakenError.ts";
import { ConvertedUser } from "../../types/types.ts";
import { Group } from "../Entities/Group.ts";
import { Logger } from "../../../interfaceTypes/Logger.ts";
import { RepositoryView } from "../../../interfaceTypes/RepositoryView.ts";
import { ensureConvertedGroupIntegrity } from "../../types/ConvertedGroup.ts";
import { WrongInvitationTypeError } from "../errors/controllerErrors/ConflictError/WrongInvitationTypeError.ts";
import { Invitation } from "../Values/Invitation.ts";
import { UserI } from "../../../interfaceTypes/UserI.ts";

export class ServiceController extends HeadController {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly userRepository: RepositoryView<UserI>,
    private readonly groupRepository: RepositoryView<Group>,
    logging: Logger,
  ) {
    super(logging.withOwnContext("ServiceController"));
  }

  async listMyServices(
    c: Context,
  ) {
    try {
      const ME = this.getMeFromContext(c);
      const serviceList = await this.serviceRepository.findOwnedByUserId(
        ME.getId(),
      );
      const convertedList: ConvertedService[] = serviceList.map(
        (e: Service) => {
          e.checkOwner(ME);
          return e.toJson();
        },
      );
      return c.json(convertedList);
    } catch (error) {
      return this.errorHandle(error, c);
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
      return c.body(null, 201);
    } catch (error) {
      return this.errorHandle(error, c);
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
      const settledRecords: PromiseSettledResult<UserI>[] = await Promise
        .allSettled(
          serviceData.users.map((e) =>
            this.userRepository.findByDisplayName(e)
          ),
        );
      const { fulfilled: users, rejected: notfound } = PromisesUtil
        .splitSettled<
          UserI,
          NotFoundError
        >(settledRecords);
      const alreadyAuthorized: ConvertedUser[] = [];
      const fulfilledUsers: ConvertedUser[] = [];
      users.forEach((u) => {
        try {
          service.giveAuthorizationToUser(u);
          fulfilledUsers.push(u.toJson());
        } catch (error) {
          if (error instanceof AlreadyTakenError) {
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
          if (error instanceof AlreadyTakenError) {
            alreadyIn.push(toPromote);
          }
          if (error instanceof NotFoundError) {
            rejectedUsers.push(toPromote);
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
  async acceptInvitation(c: Context) {
    try {
      const ME = this.getMeFromContext(c);
      const data = await c.req.json();
      ensureConvertedGroupIntegrity(data, ["id", "serviceInvitations"]);
      const group: Group = await this.groupRepository.findById(
        data.id,
      );
      group.checkOwner(ME);
      const settled = await Promise.allSettled(
        data.serviceInvitations.map(async (invitation) => {
          const [sendername, objname, receivername, type] = invitation.split(
            ":",
          );
          if (type !== "service") {
            return Promise.reject(
              new WrongInvitationTypeError(
                invitation + " is not a service invitation",
              ),
            );
          }
          if (receivername != group.getDisplayName()) {
            throw new WrongInvitationTypeError(
              invitation + " is not for this Group",
            );
          }
          const service: Service = await this.serviceRepository
            .findByDisplayName(
              objname,
            );
          const sender = await this.userRepository
            .findByDisplayName(
              sendername,
            );
          service.checkOwner(sender);
          const acceptableInvite = new Invitation(
            sender.convertToShort(),
            service.convertToShort(),
            group.convertToShort(),
            "service",
          );
          service.acceptInvitation(acceptableInvite);
          await this.serviceRepository.save(service);
          return Promise.resolve(acceptableInvite);
        }),
      );
      const { fulfilled, rejected } = PromisesUtil.splitSettled<
        Invitation,
        Error
      >(
        settled,
      );

      return c.json({
        fulfilled: fulfilled.map((e) => e.toString()),
        rejected: rejected.map((e) => e.message),
      });
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }
  async inviteGroupsToService(c: Context) {
    try {
      const ME = this.getMeFromContext(c);
      const serviceData: ConvertedService = await c.req.json();
      ensureConvertedServiceIntegrity(serviceData, ["id", "sentInvitations"]);
      const service: Service = await this.serviceRepository.findById(
        serviceData.id,
      );
      service.checkOwner(ME);
      const settled = await Promise.allSettled(
        serviceData.sentInvitations.map((invitation) => {
          return this.groupRepository.findByDisplayName(invitation);
        }),
      );
      const { fulfilled: groups, rejected: notfound } = PromisesUtil
        .splitSettled<Group, NotFoundError>(settled);
      const alreadyIn: string[] = [];
      const fulfilledGroups: string[] = [];
      groups.forEach((g) => {
        try {
          service.sendInvitation(g, ME);
          fulfilledGroups.push(g.getDisplayName());
        } catch {
          alreadyIn.push(g.getDisplayName());
        }
      });
      await this.serviceRepository.save(service);
      return c.json({
        rejected: notfound.map((e) => e.key),
        fulfilled: fulfilledGroups,
        alreadyIn: alreadyIn,
      });
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }
  async delete(c: Context) {
    try {
      const ME = this.getMeFromContext(c);
      const serviceData: ConvertedService = await c.req.json();
      ensureConvertedServiceIntegrity(serviceData, "id");
      const service: Service = await this.serviceRepository.findById(
        serviceData.id,
      );
      service.checkOwner(ME);
      await this.serviceRepository.delete(service);
      return c.body(null, 204);
    } catch (error) {
      return this.errorHandle(error, c);
    }
  }
}
