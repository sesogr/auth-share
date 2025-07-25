import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import process from "node:process";

const app = new Application();
const port: number = Number(process.env.PORT) || 3000;
const router = new Router();
const decoder = new TextDecoder("utf-8");
const certfile = await Deno.readFile("./certs/mycert.crt");
const keyfile = await Deno.readFile("./certs/mykey.key");
const key = decoder.decode(keyfile);
const cert = decoder.decode(certfile);

router.get("/", async (context) => {
  console.log("ich bin hier");
  context.cookies.set("testcookie", "yes", {
    domain: "localhost",
    sameSite: "none",
    expires: new Date(Date.now() + 500000),
  });
  const fetcher = await fetch("", {
    credentials: "include",
  });

  if (!fetcher.ok) {
    return;
  }
  console.log(fetcher);
  let body = fetcher.body;
  let head = fetcher.headers;

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
      <iframe id="1" src="" width="100%" height="600px" style="border:none;"></iframe>
      <script>
      </script>
      </body>
    </html>
  `;
  //context.response.headers = head;
  context.response.body = embeddedWebsite;
});
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({
  port: port,
  secure: true,
  cert: cert,
  key: key,
});
