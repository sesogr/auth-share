import { Relationships } from "@denodb";
import { DbGroup } from "./DbGroup.ts";
import { DbService } from "./DbService.ts";
export const DbGroupService = Relationships.manyToMany(
  DbGroup,
  DbService,
);
