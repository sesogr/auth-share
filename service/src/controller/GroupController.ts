import { GroupRepository } from "../interfaceTypes/GroupRepository.ts";

export class GroupController {
  constructor(private readonly groupRepository: GroupRepository) {}
}
