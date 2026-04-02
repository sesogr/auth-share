import { Group } from "../src/classes/Entities/Group.ts";
import type { Repository } from "./Repository.ts";

export type GroupRepository =
  & Repository<Group>
  & {
    findOwnedByUserId(userId: string): Promise<Group[]>;
  };
