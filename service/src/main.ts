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
import { ServiceController } from "./controller/ServiceController.ts";
import { GroupRepository } from "./interfaceTypes/GroupRepository.ts";
import { ServiceRepository } from "./interfaceTypes/ServiceRepository.ts";
import { UserRepository } from "./interfaceTypes/UserRepository.ts";
import { DbInvitation } from "./classes/Repositories/DenoDB/Models/DbInvitation.ts";
import { DbServiceCredential } from "./classes/Repositories/DenoDB/Models/DbServiceCredentials.ts";
import { DbUserCredential } from "./classes/Repositories/DenoDB/Models/DbUserCredentials.ts";
import { DbUserService } from "./classes/Repositories/DenoDB/Models/DbUserService.ts";
import { setupManyToMany } from "./classes/Repositories/DenoDB/Models/setupManyToMany.ts";
import { DbServiceRepository } from "./classes/Repositories/DenoDB/DbServiceRepository.ts";
import { DbGroupRepository } from "./classes/Repositories/DenoDB/DbGroupRepository.ts";
import { DbSessions } from "./classes/Repositories/DenoDB/Models/DbSessions.ts";
import { Environment } from "./classes/Environment.ts";
import { GroupController } from "./controller/GroupController.ts";
import { Logger } from "./interfaceTypes/Logger.ts";
import { LogWriter } from "./classes/Logging/LogWriter.ts";

const logging: Logger = new LogWriter(
  ["error", "info", "warn", "debug"],
  "main",
  "/.logs/info.log",
);
Environment.load();
const db = new Database(
  new MySQLConnector({
    database: Environment.DB_NAME,
    host: Environment.DB_HOST,
    username: Environment.DB_USER,
    password: Environment.DB_PASSWORD,
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
  DbSessions,
]);

let connected = false;
while (!connected) {
  try {
    await db.sync();
    connected = true;
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes("failed to lookup address information") ||
        error.message.includes("Connection refused")
      ) {
        logging.warn(
          "Connection to database failed. Retrying in 5 seconds...",
        );
      } else if (error.message === "Multiple primary key defined") {
        // Tables already exist, which is fine
        connected = true;
      } else {
        throw error;
      }
    }
  }
  if (!connected) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

const serviceRepository: ServiceRepository = new DbServiceRepository();
const groupRepository: GroupRepository = new DbGroupRepository();
const userRepository: UserRepository = new DbUserRepository();
const userController = new UserController(userRepository, logging);
const serviceController = new ServiceController(
  serviceRepository,
  userRepository,
  groupRepository,
  logging,
);
const groupController = new GroupController(
  groupRepository,
  userRepository,
  serviceRepository,
  logging,
);
export const app = new Hono();
app.use(
  "*",
  cors({
    origin: Environment.FRONT_END_URL,
    credentials: true,
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.use("*", (c, next) => {
  logging.log(c.req.method, c.req.url);
  return next();
});
app.use(
  "*",
  except(
    ["/register", "/login"],
    (c, next) => userController.authMiddleware(c, next),
  ),
);

app.post("/login", (c) => userController.logIn(c));
app.post("/logout", (c) => userController.logOut(c));
app.get("/user/me", (c) => userController.read(c));
app.patch("/user/me/password", (c) => userController.changePassword(c));
app.patch("/user/me/displayname", (c) => userController.changeDisplayName(c));
app.get("/user/owned", (c) => serviceController.listMyServices(c));
app.delete("/user/me", (c) => userController.delete(c));
app.delete("/service", (c) => serviceController.delete(c));
app.patch("/service/users", (c) => serviceController.addUsersToService(c));
app.patch(
  "/service/users/promote",
  (c) => serviceController.promoteUsersOfService(c),
);
app.post("/register", (c) => userController.create(c));
app.post("/service/create", (c) => serviceController.add(c));
app.post(
  "/service/invitation/create",
  (c) => serviceController.inviteGroupsToService(c),
);
app.patch(
  "/service/invitation/accept",
  (c) => serviceController.acceptInvitation(c),
);
app.delete("/group", (c) => groupController.delete(c));
app.get("/group/owned", (c) => groupController.listMyGroups(c));
app.post("/group/create", (c) => groupController.createGroup(c));
app.post("/group/invitation/create", (c) => groupController.inviteUsers(c));
app.patch(
  "/group/invitation/accept",
  (c) => groupController.acceptInvitation(c),
);
// Server start
Deno.serve(app.fetch);
