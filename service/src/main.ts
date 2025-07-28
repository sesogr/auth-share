import { Application, Router } from "https://deno.land/x/oak@v17.1.5/mod.ts";
import logindetails from "../certs/logindetails.json" with { type: "json" };
import process from "node:process";

const app = new Application();
const port: number = Number(process.env.PORT) || 3000;
const router = new Router();
const decoder = new TextDecoder("utf-8");
const certfile = await Deno.readFile("./certs/mycert.crt");
const keyfile = await Deno.readFile("./certs/mykey.key");
const key = decoder.decode(keyfile);
const cert = decoder.decode(certfile);

router.get("/liveconfig/login", async (context) => {
  context.cookies.set("testcookie", "yes", {
    domain: "localhost",
    sameSite: "none",
    expires: new Date(Date.now() + 500000),
  });

  const data:RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: 'include',
    body: `a=2&l=${logindetails.l}&p=${logindetails.p}&lang=&c=1`,
  }
  const request = new Request("https://lc.commodea.com/liveconfig/login", data)
  const fetchresponse = await fetch(request);
  if (!fetchresponse.ok) {
    return;
  }
  const cookie = fetchresponse.headers.getSetCookie()
  try {
    if (!cookie.length){
      throw Error("no cookie found")
    }
    context.response.headers.set("set-cookie", cookie[0] + "; SameSite = none")
    }catch (e){
      if (e instanceof Error){
        console.log(e.message)
      }
    }
    console.log(fetchresponse.headers)
  context.response.body = "<!DOCTYPE html><html><head><title>hallo</title></head><body>hallo</body></html>"
});
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({
  port: port,
  secure: true,
  cert: cert,
  key: key,
});
