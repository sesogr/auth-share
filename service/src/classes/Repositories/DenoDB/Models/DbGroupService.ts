import { Model, Relationships } from "@denodb";
import { DbGroup } from "./DbGroup.ts";
import { DbService } from "./DbService.ts";

export let DbGroupService: typeof Model;

export function setupGroupService() {
  DbGroupService = Relationships.manyToMany(
    DbGroup,
    DbService,
  );
}
