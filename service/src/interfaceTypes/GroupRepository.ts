import { Group } from "../classes/Group.ts";
import { GroupRepositoryView } from "./GroupRepositoryView.ts";
import type { Repository } from "./Repository.ts";

export type GroupRepository = Repository<Group> &
  GroupRepositoryView & {
    findOwnedByUserId(userId: string): Group[];
  };
