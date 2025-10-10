import { DataTypes, Model, Relationships } from "@denodb";
import { DbGroup } from "./DbGroup.ts";
import { DbUser } from "./DbUser.ts";
export let DbUserGroup: typeof Model;
export function setupUserGroup() {
  DbUserGroup = Relationships.manyToMany(
    DbUser,
    DbGroup,
  );
  DbUserGroup.fields = {
    ...DbUserGroup.fields,
    isOwner: DataTypes.BOOLEAN,
  };
}
