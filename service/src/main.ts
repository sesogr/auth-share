import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { FakeObjectGen } from "./FakeObjectGen.ts";
import { User } from "./classes/User.ts";
import { Group } from "./classes/Group.ts";
import {
  ConvertedUser,
  ConvertedGroup,
  ConvertedService,
} from "./types/types.ts";
import { Service } from "./classes/Service.ts";

const app = new Hono();
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  })
);
//new
const userList: User[] = [];

for (let i = 0; i < 10; i++) {
  const fakeUser = FakeObjectGen.createFakeUser();
  userList.push(fakeUser);
}

const firstUser = userList[0];

for (let i = 0; i < 3; i++) {
  const service = FakeObjectGen.createFakeService(firstUser);
}

const testGroup: Group[] = [];

for (let i = 0; i < 5; i++) {
  const fakeGroup = FakeObjectGen.createFakeGroup(undefined, userList[i]);
  testGroup.push(fakeGroup);
}

// Route für die Hauptseite
app.get("/", (c) => {
  return c.text("Hello from the Trees!");
});

// Neue Route, die Daten von einer externen URL abruft
app.get("/data", async (c) => {
  const url = "https://jsonplaceholder.typicode.com/posts"; // Ersetze dies durch deine URL

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Netzwerkantwort war nicht ok");
    }
    const data = await response.json(); // Konvertiere die Antwort in JSON
    return c.json(data); // Gebe die abgerufenen Daten als JSON zurück
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
    return c.text("Fehler beim Abrufen der Daten", 500);
  }
});

/*app.get("/user", (c) => {
  FakeObjectGen.createFakeUser("", "", "");
  const user = userList;
  return c.json(user);
});*/

app.get("/user", (c) => {
  const convertedList: ConvertedUser[] = userList.map((e) => e.toJson());
  return c.json(convertedList);
});

app.get("/user/owned", (c) => {
  const firstUser: User = userList[0];
  if (!firstUser) return c.json({ error: "No users" }, 404);

  const serviceList: Service[] = firstUser.listOwnedServices();
  const convertedList: ConvertedService[] = serviceList.map((e) => e.toJson());
  return c.json(convertedList);
});

app.get("/group", (c) => {
  const convertedGroupList: ConvertedGroup[] = testGroup.map((e) => e.toJson());
  return c.json(convertedGroupList);
});

// Server starten
Deno.serve(app.fetch);
