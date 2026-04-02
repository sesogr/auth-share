import { Service } from "../src/classes/Entities/Service.ts";
import type { Repository } from "./Repository.ts";

export type ServiceRepository =
  & Repository<Service>
  & {
    findOwnedByUserId(_userId: string): Promise<Service[]>;
    findAuthorizedForId(_Id: string): Promise<Service[]>;
  };
