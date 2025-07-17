import { client } from "./database.ts";
client.execute("select * from groups").then((response) => {
  console.log(response);
});
