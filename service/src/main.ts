// @ts-types="npm:@types/express@4.17.15"
import express from "npm:express";
import cookie_parser from "npm:cookie-parser";

const app = express();
const port = process.env.PORT || 3000;
app.use(cookie_parser());
app.get("/", async (req, res) => {
  console.log("ich bin hier");
  res.cookie("testcookie", "yes", {
    domain: "wekan.sedna-soft.de",
    expires: new Date(Date.now() + 500000),
  });
  const embeddedWebsite = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Embedded Website</title>
    </head>
    <body>
      <h1>Embedded Website Example</h1>
      <iframe src="https://wekan.sedna-soft.de/" width="100%" height="600px" style="border:none;"></iframe>
    </body>
    </html>
  `;
  res.send(embeddedWebsite);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
