import { ServiceRepository } from "../../../interfaceTypes/ServiceRepository.ts";
import { Service } from "../../Service.ts";
import { DbService } from "./Models/DbService.ts";
import { ServiceCredential } from "../../ServiceCredential.ts";
import { Model } from "@denodb";
import { DbUserService } from "./Models/DbUserService.ts";
import { DbIdDisplayname } from "./Models/DbIdDisplayname.ts";
import { AllowedUserServiceMap } from "../../AllowedUserServiceMap.ts";
import { IdNameMap } from "../../IdNameMap.ts";
import { NotFoundError } from "../../../errors/NotFoundError.ts";
import { DbGroupService } from "./Models/DbGroupService.ts";
import { AllowedGroupServiceMap } from "../../AllowedGroupServiceMap.ts";
import { RuntimeError } from "../../../errors/RuntimeError.ts";
import { Invitation } from "../../Invitation.ts";
import { DbServiceCredential } from "./Models/DbServiceCredentials.ts";
import { DbInvitation } from "./Models/DbInvitation.ts";

export class DbServiceRepository implements ServiceRepository {
  constructor() {
  }
  async findOwnedByUserId(userId: string): Promise<Service[]> {
    const userServiceData: DbService[] = await DbUserService.where(
      "user_id",
      userId,
    )
      .hasMany(DbService) as DbService[];
    return Promise.all(
      userServiceData.map((e: DbService) => this.hydrate(e.id)),
    );
  }
  findAuthorizedForId(_Id: string): Promise<Service[]> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<Service> {
    return this.hydrate(id);
  }
  findByName(_name: string): Promise<Service> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<Service[]> {
    throw new Error("Method not implemented.");
  }
  async add(item: Service): Promise<void> {
    await DbService.create({
      id: item.getId(),
      serviceName: item.getDisplayName(),
    });
    await DbServiceCredential.create({
      username: item.credentials.split(":")[0],
      password: item.credentials.split(":")[1],
    });
    for (const authorizedUsermap of item.authorizedUsers) {
      await DbUserService.create({
        user_id: authorizedUsermap.userId,
        service_id: authorizedUsermap.serviceId,
        is_owner: authorizedUsermap.isOwner,
      });
    }
    for (const authorizedGroupmap of item.authorizedGroups) {
      await DbGroupService.create({
        group_id: authorizedGroupmap.groupId,
        service_id: authorizedGroupmap.serviceId,
      });
    }
    for (const invites of item.sentInvitations) {
      await DbInvitation.create({
        senderReference: invites.senderId,
        objReference: invites.objId,
        receiverReference: invites.receiverId,
      });
    }
    await DbIdDisplayname.create({
      id: item.getId(),
      displayname: item.getDisplayName(),
    });
  }
  removeById(_id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async save(item: Service): Promise<void> {
    if (!(await this.findById(item.getId()))) {
      this.add(item);
    }
  }

  async hydrate(searchedId: string): Promise<Service> {
    const item = DbService.where("id", searchedId);
    const service = await item.first() as DbService;
    if (!service) throw new NotFoundError("Item not Found: " + searchedId);
    const id = service.id.toString();
    const servicename = service.servicename.toString();
    let credentials: ServiceCredential | DbServiceCredential = await item
      .credentials();
    credentials = new ServiceCredential(
      credentials.username.toString(),
      credentials.password.toString(),
    );
    const userserviceData = await item.authorizedUsers();
    const authorizedUsers: AllowedUserServiceMap[] = await Promise.all(
      userserviceData.map(
        this.createMapCallbackallowedLists(id, servicename, "user"),
      ),
    ) as AllowedUserServiceMap[];
    const groupserviceData = await item.authorizedGroups();
    const authorizedGroups: AllowedGroupServiceMap[] = await Promise.all(
      groupserviceData.map(
        this.createMapCallbackallowedLists(id, servicename, "group"),
      ),
    ) as AllowedGroupServiceMap[];
    const InvitationData = item.Invitation();

    const sentInvites: Invitation[] = await Promise.all(
      (await InvitationData).map(async (e) => {
        const senderId = e.senderReference?.toString() ?? "";
        const objId = e.objReference?.toString() ?? "";
        const receiverId = e.receiverReference?.toString() ?? "";
        return new Invitation(
          new IdNameMap(
            senderId,
            await DbIdDisplayname.displayname(senderId),
          ),
          new IdNameMap(
            objId,
            await DbIdDisplayname.displayname(objId),
          ),
          new IdNameMap(
            receiverId,
            await DbIdDisplayname.displayname(receiverId),
          ),
        );
      }),
    );
    return new Service(
      credentials,
      servicename,
      id,
      sentInvites,
      authorizedUsers,
      authorizedGroups,
    );
  }
  private createMapCallbackallowedLists(
    serviceId: string,
    servicename: string,
    type: "group" | "user",
  ): (
    value: Model,
    index: number,
    array: Model[],
  ) => Promise<AllowedUserServiceMap | AllowedGroupServiceMap> {
    return async (e) => {
      if (!e[type + "_id"]) throw new NotFoundError("group_id");
      const id = e[type + "_id"]!.toString();

      const displayname = await DbIdDisplayname.where(
        "id",
        id.toString(),
      ).first();
      if (!displayname.displayname) {
        throw new NotFoundError("userdisplayname");
      }
      if (type == "user") {
        const newLocal = displayname.displayname;
        return new AllowedUserServiceMap(
          new IdNameMap(
            id,
            newLocal.toString(),
          ),
          new IdNameMap(serviceId, servicename),
          e.is_owner?.valueOf() as boolean ?? false,
        );
      }

      if (type == "group") {
        return new AllowedGroupServiceMap(
          new IdNameMap(
            id,
            displayname.displayname.toString(),
          ),
          new IdNameMap(serviceId, servicename),
        );
      }
      throw new RuntimeError();
    };
  }
}
