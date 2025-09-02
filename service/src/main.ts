import { Hono } from "@hono/hono";
import { FakeObjectGen } from "./FakeObjectGen.ts";
import { User } from "./classes/User.ts";
import { Group } from "./classes/Group.ts";

const app = new Hono();
/* old
const userList = [1, 2, 3, 4].map((c) => FakeObjectGen.createFakeUser());
const testGroup = FakeObjectGen.createFakeGroup(undefined, userList[0]);
 */

//new
const userList: User[] = [];

for (let i = 0; i < 10; i++) {
  const fakeUser = FakeObjectGen.createFakeUser();
  userList.push(fakeUser);
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
  const convertedList = userList.map((e) => e.toJson());
  return c.json(convertedList);
});

app.get("/group", (c) => {
  const convertedGroupList = testGroup.map((e) => e.toJson());
  return c.json(convertedGroupList);
});

// Server starten
Deno.serve(app.fetch);
