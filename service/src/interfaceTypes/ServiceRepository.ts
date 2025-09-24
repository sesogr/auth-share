import { Service } from "../classes/Service.ts";
import type { Repository } from "./Repository.ts";
import { ServiceRepositoryView } from "./ServiceRepositoryView.ts";

export type ServiceRepository =
  & Repository<Service>
  & ServiceRepositoryView
  & {
    findOwnedByUserId(userId: string): Service[];
    findAuthorizedForId(Id: string): Service[];
  };
