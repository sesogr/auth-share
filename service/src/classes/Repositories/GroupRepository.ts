import { Group } from "../Group.ts";
import { InMemoryRepository } from "./InMemoryRepository.ts";

export class GroupRepository extends InMemoryRepository<Group> {
  findOwenedByUserId(userId: string): Group[] {
    return this.inMemList.filter((group) =>
      group.getOwner().getId() === userId
    );
  }
}
