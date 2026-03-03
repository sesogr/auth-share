import { DataTypes, Model, Relationships } from "@denodb";
import { DbService } from "./DbService.ts";
import { DbUser } from "./DbUser.ts";

export type DbUserServiceTable = Model & {
  dbuserId: string;
  dbserviceId: string;
  id: string;
  isOwner: boolean;
};

let DbUserService: typeof Model;

export function setupUserService() {
  //@ts-ignore we are assigning immediatly after declaration
  DbUserService = Relationships.manyToMany(
    DbUser,
    DbService,
  );
  DbUserService.fields = {
    ...DbUserService.fields,
    id: { primaryKey: true, type: DataTypes.STRING },
    isOwner: DataTypes.BOOLEAN,
  };
  return DbUserService;
}

export { DbUserService };

// const us = Relationships.manyToMany(User, Service);
// us.fields = {
//   ...us.fields,
//   isOwner: DataTypes.BOOLEAN,
