import { Database, MySQLConnector } from "@denodb";
import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { FakeObjectGen } from "./FakeObjectGen.ts";
import { DbUserRepository } from "./classes/Repositories/DenoDB/DbUserRepository.ts";
import { DbGroup } from "./classes/Repositories/DenoDB/Models/DbGroup.ts";
import { DbGroupService } from "./classes/Repositories/DenoDB/Models/DbGroupService.ts";
import { DbService } from "./classes/Repositories/DenoDB/Models/DbService.ts";
import { DbUser } from "./classes/Repositories/DenoDB/Models/DbUser.ts";
import { DbUserGroup } from "./classes/Repositories/DenoDB/Models/DbUserGroup.ts";
import { InMemGroupRepository } from "./classes/Repositories/InMem$Repositories/InMemGroupRepository.ts";
import { InMemServiceRepository } from "./classes/Repositories/InMem$Repositories/InMemServiceRepository.ts";
import { UserController } from "./controller/UserController.ts";
import { DataController } from "./controller/DataController.ts";
import { RootController } from "./controller/RootController.ts";
import { ServiceController } from "./controller/ServiceController.ts";
import { GroupRepository } from "./interfaceTypes/GroupRepository.ts";
import { ServiceAggregateView } from "./interfaceTypes/ServiceAggregateView.ts";
import { ServiceRepository } from "./interfaceTypes/ServiceRepository.ts";
import { UserRepository } from "./interfaceTypes/UserRepository.ts";

const db = new Database(
  new MySQLConnector({
    database: Deno.env.get("DB_NAME")!,
    host: Deno.env.get("DB_HOST")!,
    username: Deno.env.get("DB_USER")!,
    password: Deno.env.get("DB_PASSWORD")!,
  }),
);
db.link([DbGroup, DbUser, DbUserGroup, DbGroupService, DbService]);
//initialize repositories
const serviceRepository: ServiceAggregateView & ServiceRepository =
  new InMemServiceRepository();
const groupRepository: GroupRepository = new InMemGroupRepository(
  serviceRepository,
);
const userRepository: UserRepository = new DbUserRepository();
// FakeObjectGen.generateFakeUsers().forEach(async (e) =>
//   await userRepository.save(e)
// );
FakeObjectGen.generateFakeGroups().forEach((e) => groupRepository.save(e));
FakeObjectGen.generateFakeServices().forEach((e) => serviceRepository.save(e));
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
app.get("/", rootController.sayHelloFromTrees);

const dataController = new DataController();
app.get("/data", dataController.getData);

const userController = new UserController(userRepository);
app.get("/user", userController.read);

app.put("/user/me/password", userController.changePassword);

const serviceController = new ServiceController(
  serviceRepository,
  userRepository,
);
app.get(
  "/user/owned",
  serviceController.listMyServices, //TODO!!! Needs to be fixed!
);

app.put();

app.post("/user", userController.create);

//app.get("/group", groupController);

// Server starten
Deno.serve(app.fetch);
