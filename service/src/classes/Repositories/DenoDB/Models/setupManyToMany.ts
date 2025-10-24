import { setupGroupService } from "./DbGroupService.ts";
import { setupUserGroup } from "./DbUserGroup.ts";
import { setupUserService } from "./DbUserService.ts";

export function setupManyToMany() {
  setupUserService();
  setupGroupService();
  setupUserGroup();
}
