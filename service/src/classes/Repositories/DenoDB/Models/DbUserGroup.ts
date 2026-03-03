import { DataTypes, Model, Relationships } from "@denodb";
import { DbGroup } from "./DbGroup.ts";
import { DbUser } from "./DbUser.ts";
export let DbUserGroup: typeof Model & {
  id: string;
  isOwner: boolean;
};
export function setupUserGroup() {
  //@ts-ignore we are assigning immediatly after declaration
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
