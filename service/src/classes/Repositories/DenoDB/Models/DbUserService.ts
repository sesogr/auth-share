import { DataTypes, Model, Relationships } from "@denodb";
import { DbService } from "./DbService.ts";
import { DbUser } from "./DbUser.ts";
export const DbUserService: typeof Model = Relationships.manyToMany(
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
