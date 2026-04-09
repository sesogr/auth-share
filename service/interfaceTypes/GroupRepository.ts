import { Group, OwnedGroups } from "../src/classes/Entities/Group.ts";
import type { Repository } from "./Repository.ts";

export type GroupRepository =
  & Repository<Group>
  & {
    findOwnedByUserId(userId: string): Promise<Group[]>;
    delete(group: OwnedGroups): Promise<void>;
  };
