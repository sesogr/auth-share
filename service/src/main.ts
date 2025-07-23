// @ts-types="npm:@types/express@4.17.15"
import express from "npm:express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.text());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});
app.get("/testconnection", (req, res) => {
  res.send();
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
