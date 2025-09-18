import { Service } from "../classes/Service.ts";
import { ServiceCredential } from "../classes/ServiceCredential.ts";
import type { Repository } from "./Repository.ts";

export type ServiceRepository = Repository<Service> & {
  listAuthorizedUsers(serviceId: string): string[];
  listAuthorizedGroups(serviceId: string): string[];
  listOwners(serviceId: string): string[];
  createService(
    ownerId: string,
    credentials: ServiceCredential,
    serviceName: string,
  ): void;
};
