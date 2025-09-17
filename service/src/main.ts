import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { User } from "./classes/User.ts";
import { Repository } from "./interfaceTypes/Repository.ts";
import { rootController } from "./controller/rootController.ts";
import { dataController } from "./controller/dataController.ts";
import { serviceController } from "./controller/serviceController.ts";
import { GroupRepository } from "./interfaceTypes/GroupRepository.ts";
import { ServiceRepository } from "./interfaceTypes/ServiceRepository.ts";
import { InMemoryRepository } from "./classes/Repositories/InMemoryRepository.ts";
import { InMemGroupRepository } from "./classes/Repositories/InMemGroupRepository.ts";
import { InMemServiceRepository } from "./classes/Repositories/InMemServiceRepository.ts";

//initialize repositories
const userRepository: Repository<User> = new InMemoryRepository<User>();
const _groupRepository: GroupRepository = new InMemGroupRepository(
  userRepository.findAll()[0],
);
const serviceRepository: ServiceRepository = new InMemServiceRepository(
  userRepository.findAll()[0],
);

export const app = new Hono();
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.get("/", rootController("Trees"));

app.get("/data", dataController);

//app.get("/user", userController);

app.get(
  "/user/owned",
  serviceController(serviceRepository, userRepository.findAll()[0].getId()), //TODO!!! Needs to be fixed!
);

//app.get("/group", groupController);

// Server starten
Deno.serve(app.fetch);
