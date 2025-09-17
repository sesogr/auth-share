import { Service } from "../classes/Service.ts";
import type { Repository } from "./Repository.ts";

export type ServiceRepository = Repository<Service> & {
  findOwnedByUserId(userId: string): Service[];
};
