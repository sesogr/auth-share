import { Database, MySQLConnector } from "@denodb";
import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { DbUserRepository } from "./classes/Repositories/DenoDB/DbUserRepository.ts";
import { DbGroup } from "./classes/Repositories/DenoDB/Models/DbGroup.ts";
import { DbGroupService } from "./classes/Repositories/DenoDB/Models/DbGroupService.ts";
import { DbService } from "./classes/Repositories/DenoDB/Models/DbService.ts";
import { DbUser } from "./classes/Repositories/DenoDB/Models/DbUser.ts";
import { DbUserGroup } from "./classes/Repositories/DenoDB/Models/DbUserGroup.ts";
import { UserController } from "./controller/UserController.ts";
import { DataController } from "./controller/DataController.ts";
import { RootController } from "./controller/RootController.ts";
import { ServiceController } from "./controller/ServiceController.ts";
import { GroupRepository } from "./interfaceTypes/GroupRepository.ts";
import { ServiceRepository } from "./interfaceTypes/ServiceRepository.ts";
import { UserRepository } from "./interfaceTypes/UserRepository.ts";
import { DbIdDisplayname } from "./classes/Repositories/DenoDB/Models/DbIdDisplayname.ts";
import { DbInvitation } from "./classes/Repositories/DenoDB/Models/DbInvitation.ts";
import { DbServiceCredential } from "./classes/Repositories/DenoDB/Models/DbServiceCredentials.ts";
import { DbUserCredential } from "./classes/Repositories/DenoDB/Models/DbUserCredentials.ts";
import { DbUserService } from "./classes/Repositories/DenoDB/Models/DbUserService.ts";
import { setupManyToMany } from "./classes/Repositories/DenoDB/Models/setupManyToMany.ts";
import { DbServiceRepository } from "./classes/Repositories/DenoDB/DbServiceRepository.ts";
import { DbGroupRepository } from "./classes/Repositories/DenoDB/DbGroupRepository.ts";

const db = new Database(
  new MySQLConnector({
    database: Deno.env.get("DB_NAME")!,
    host: Deno.env.get("DB_HOST")!,
    username: Deno.env.get("DB_USER")!,
    password: Deno.env.get("DB_PASSWORD")!,
  }),
);
setupManyToMany();
db.link([
  DbUser,
  DbService,
  DbGroup,
  DbUserService,
  DbUserCredential,
  DbServiceCredential,
  DbUserGroup,
  DbGroupService,
  DbInvitation,
  DbIdDisplayname,
]);
//initialize repositories
const serviceRepository: ServiceRepository = new DbServiceRepository();
const _groupRepository: GroupRepository = new DbGroupRepository();
const userRepository: UserRepository = new DbUserRepository();
// Promise.all(FakeObjectGen.generateFakeUsers().map(async (e) =>
//   await userRepository.save(e))
// );
// Promise.all(
//   FakeObjectGen.generateFakeGroups().map((e) => groupRepository.save(e)),
// );
// Promise.all(
//   FakeObjectGen.generateFakeServices().map((e) => serviceRepository.save(e)),
// );
// userRepository.findAll().forEach((e) => {
//   serviceRepository.save(FakeObjectGen.createFakeService(e.convertToShort()));
// });
export const app = new Hono();
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
//Endpoints
const rootController = new RootController("Trees");
app.get("/", (c) => {
  return rootController.sayHelloFromTrees(c);
});

const dataController = new DataController();
app.get("/data", (c) => {
  return dataController.getData(c);
});

const userController = new UserController(userRepository);
app.get(
  "/user",
  (c) => {
    return userController.read(c);
  },
);

app.put(
  "/user/me/password",
  (c) => {
    return userController.changePassword(
      c,
    );
  },
);

const serviceController = new ServiceController(
  serviceRepository,
  userRepository,
);
app.get(
  "/user/owned",
  (c) => {
    return serviceController.listMyServices(
      c,
    );
  }, //TODO!!! Needs to be fixed!
);

app.put();

app.post("/user", (c) => {
  return userController.create(c);
});

app.post("/service/create", (c) => {
  return serviceController.add(c);
});

//app.get("/group", groupController);

// Server starten
Deno.serve(app.fetch);
