import { DataTypes, Relationships } from "@denodb";
import { DbGroup } from "./DbGroup.ts";
import { DbUser } from "./DbUser.ts";
export const DbUserGroup = Relationships.manyToMany(
  DbUser,
  DbGroup,
);
DbUserGroup.fields = {
  ...DbUserGroup.fields,
  isOwner: DataTypes.BOOLEAN,
};
