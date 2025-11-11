import { DataTypes, Model, Relationships } from "@denodb";
import { DbGroup } from "./DbGroup.ts";
import { DbService } from "./DbService.ts";

export let DbGroupService: typeof Model;

export function setupGroupService() {
  DbGroupService = Relationships.manyToMany(
    DbGroup,
    DbService,
  );
  DbGroupService.fields = {
    ...DbGroupService.fields,
    id: { primaryKey: true, type: DataTypes.STRING },
  };
}
