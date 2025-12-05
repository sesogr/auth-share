import { Database, MySQLConnector } from "@denodb";
import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { except } from "@hono/hono/combine";
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
import { DbSessions } from "./classes/Repositories/DenoDB/Models/DbSessions.ts";
import { getCookie } from "@hono/hono/cookie";
import { User } from "./classes/User.ts";
import { UserCredential } from "./classes/UserCredential.ts";

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
  DbSessions,
]);
let ME: User = new User(await UserCredential.create("", ""));
try {
  await db.sync();
} catch (error) {
  if (error instanceof Error) {
    if (error.message != "Multiple primary key defined") {
      throw error; //it throws the multiple keys always when the database is already filled with tables
    }
  }
}
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
    origin: Deno.env.get("FRONT_END_URL")!,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.use(
  "*",
  except(["/register", "/login"], async (c, next) => {
    console.log(c.req.path);

    try {
      const sessiontoken = getCookie(c, "session")!;
      ME = await userRepository.findBySessionToken(sessiontoken);
      ME.validateSession(sessiontoken);
      await next();
    } catch (_error) {
      return new Response(null, {
        headers: c.res.headers,
        status: 403,
        statusText: "Session Expired",
      });
    }
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

const userController = new UserController(userRepository, ME);
app.post(
  "/login",
  (c) => {
    return userController.logIn(c);
  },
);
app.get(
  "/user",
  (c) => {
    return userController.read(c);
  },
);

// app.put(
//   "/user/me/password",
//   (c) => {
//     return userController.changePassword(
//       c,
//     );
//   },
// );

const serviceController = new ServiceController(
  serviceRepository,
  userRepository,
  ME,
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

app.post("/register", (c) => {
  return userController.create(c);
});

app.post("/service/create", (c) => {
  return serviceController.add(c);
});

//app.get("/group", groupController);

// Server starten
Deno.serve(app.fetch);
