import { DataTypes, Relationships } from "@denodb";
import { DbService } from "./DbService.ts";
import { DbUser } from "./DbUser.ts";
export const DbUserService = Relationships.manyToMany(
  DbUser,
  DbService,
);
DbUserService.fields = {
  ...DbUserService.fields,
  isOwner: DataTypes.BOOLEAN,
};

// const us = Relationships.manyToMany(User, Service);
// us.fields = {
//   ...us.fields,
//   isOwner: DataTypes.BOOLEAN,
