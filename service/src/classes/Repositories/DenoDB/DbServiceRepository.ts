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

export class DbServiceRepository implements ServiceRepository {
  findById(_id: string): Service {
    throw new Error("Method not implemented.");
  }
  findByName(_name: string): Service {
    throw new Error("Method not implemented.");
  }
  findAll(): Service[] {
    throw new Error("Method not implemented.");
  }
  add(_item: Service): void {
    throw new Error("Method not implemented.");
  }
  removeById(_id: string): void {
    throw new Error("Method not implemented.");
  }
  save(item: Service): void {
    if (!this.findById(item.getId())) {
      this.add(item);
    }
  }
  async hydrate(item: typeof DbService, query: string = ""): Promise<Service> {
    const service = await item.first();
    if (!service) throw new NotFoundError("Item not Found: " + query);
    const id = service.id?.toString() ?? "";
    const servicename = service.servicename?.toString() ?? "";
    let credentials: Model | ServiceCredential = await item.credentials();
    credentials = new ServiceCredential(
      credentials.username?.toString(),
      credentials.password?.toString(),
    );
    const userserviceData = this.asArray(
      await DbUserService.where("service_id", id).get(),
    );

    const authorizedUsers: AllowedUserServiceMap[] = await Promise.all(
      userserviceData.map(
        this.createMapCallbackallowedLists(id, servicename, "user"),
      ),
    ) as AllowedUserServiceMap[];
    const groupserviceData = this.asArray(
      await DbGroupService.where("service_id", id).get(),
    );
    const authorizedGroups: AllowedGroupServiceMap[] = await Promise.all(
      groupserviceData.map(
        this.createMapCallbackallowedLists(id, servicename, "group"),
      ),
    ) as AllowedGroupServiceMap[];
    const sentInvites: Invitation[] = []; //TODO
    return new Service(
      credentials,
      servicename,
      id,
      sentInvites,
      authorizedUsers,
      authorizedGroups,
    );
  }
  private asArray(data: Model | Model[]): Model[] {
    if (!Array.isArray(data)) {
      throw new RuntimeError();
    }
    return data;
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
      if (!e[type && "_id"]) throw new NotFoundError("group_id");
      const id = e[type && "_id"]!.toString();
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
  findOwnedByUserId(_userId: string): Service[] {
    throw new Error("Method not implemented.");
  }
  findAuthorizedForId(_Id: string): Service[] {
    throw new Error("Method not implemented.");
  }
}
