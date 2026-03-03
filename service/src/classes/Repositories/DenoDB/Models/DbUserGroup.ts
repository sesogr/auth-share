import { DataTypes, Model, Relationships } from "@denodb";
import { DbGroup } from "./DbGroup.ts";
import { DbUser } from "./DbUser.ts";
export type DbUserGroupTable = Model & {
  dbuserId: string;
  dbgroupId: string;
  id: string;
  isOwner: boolean;
};

export let DbUserGroup: typeof Model;
export function setupUserGroup() {
  DbUserGroup = Relationships.manyToMany(
    DbUser,
    DbGroup,
  );
  DbUserGroup.fields = {
    ...DbUserGroup.fields,
    id: { primaryKey: true, type: DataTypes.STRING },
    isOwner: DataTypes.BOOLEAN,
  };
}
