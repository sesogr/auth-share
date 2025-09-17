import { Group } from "../classes/Group.ts";
import type { Repository } from "./Repository.ts";

export type GroupRepository = Repository<Group> & {
  findOwnedByUserId(userId: string): Group[];
};
