import { GroupRepository } from "../../interfaceTypes/GroupRepository.ts";
import { Group } from "../Group.ts";
import { InMemoryRepository } from "./InMemoryRepository.ts";

export class InMemGroupRepository extends InMemoryRepository<Group>
  implements GroupRepository {
  findOwnedByUserId(userId: string): Group[] {
    return this.inMemList.filter((group) =>
      group.getOwner().getId() === userId
    );
  }
}
