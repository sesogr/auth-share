import { DataTypes, Model, Relationships } from "@denodb";
import { DbGroup } from "./DbGroup.ts";
import { DbService } from "./DbService.ts";

export let DbGroupService: typeof Model & {
  id: string;
};

export function setupGroupService() {
  //@ts-ignore we are assigning immediatly after declaration
  DbGroupService = Relationships.manyToMany(
    DbGroup,
    DbService,
  );
  DbGroupService.fields = {
    ...DbGroupService.fields,
    id: { primaryKey: true, type: DataTypes.STRING },
  };
}
