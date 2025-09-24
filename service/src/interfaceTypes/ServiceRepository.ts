import { Service } from "../classes/Service.ts";
import { ServiceCredential } from "../classes/ServiceCredential.ts";
import type { Repository } from "./Repository.ts";
import { ServiceRepositoryView } from "./ServiceRepositoryView.ts";

export type ServiceRepository =
  & Repository<Service>
  & ServiceRepositoryView
  & {
    createService(
      ownerId: string,
      credentials: ServiceCredential,
      serviceName: string,
    ): Service;
    findOwnedByUserId(userId: string): Service[];
    findAuthorizedForId(Id: string): Service[];
    fillWithMockData(userIdList: string[]): void;
  };
