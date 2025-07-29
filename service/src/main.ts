import { Application, Router } from "https://deno.land/x/oak@v17.1.5/mod.ts";
import logindetails from "../certs/logindetails.json" with { type: "json" };
import process from "node:process";

type Forminformation = {
  [key: string]: string
}

type Logins = {
  liveconfig: Liveconfig;
  wekan:      Wekan;
  github:     Github;
  [key: string]: Forminformation
}

type Github = {
  login:    string;
  password: string;
}

type Liveconfig = {
  a: string;
  c: string;
  l: string;
  p: string;
}

type Wekan = {
  "at-field-username_and_email": string;
  "at-field-password":           string;
}




const logininformation:Logins = logindetails as Logins
const github:string = `<div class="position-relative">
<input type="hidden" name="webauthn-conditional" value="undefined">
<input type="hidden" class="js-support" name="javascript-support" value="true">
<input type="hidden" class="js-webauthn-support" name="webauthn-support" value="supported">
<input type="hidden" class="js-webauthn-iuvpaa-support" name="webauthn-iuvpaa-support" value="supported">
<input type="hidden" name="return_to" id="return_to" value="https://github.com/login" autocomplete="off" class="form-control">
<input type="hidden" name="allow_signup" id="allow_signup" autocomplete="off" class="form-control">
<input type="hidden" name="client_id" id="client_id" autocomplete="off" class="form-control">
<input type="hidden" name="integration" id="integration" autocomplete="off" class="form-control">
<input class="form-control" type="text" name="required_field_aa73" hidden="hidden">
<input class="form-control" type="hidden" name="timestamp" value="1753778034795">
<input class="form-control" type="hidden" name="timestamp_secret" value="c6c74b3563fa90823d0b12cb5d04ac250e7c9785891f26de5926db07707a6a07">


  </div>`

function returnhtml(credential:string,forminfo:Forminformation){
  let html:string = "";
  if (credential=="liveconfig"){
    html = 'commodea: <form action="https://lc.commodea.com/liveconfig/login" target="_blank" method="post">'
  }else if(credential=="wekan"){
    html = 'wekan: <form action="https://wekan.sedna-soft.de/sign-in" target="_blank" method="post">'
  }else if(credential=="github"){
    html = 'github: <form action="https://github.com/session" target="_blank" method="post"><input type="hidden" data-csrf="true" name="authenticity_token" value="4xdXgWXPfeydzMY3fGq3+3tIgZPFU7dznwRufxTm77IhRa1rZy5/JhrdXsDzZwC3ppVZjxH0L5ICWpV6aRFI+Q==">'
    html += github
  }
  for (const key in forminfo){
    html = html + `<input type="hidden" name="${key}" value="${forminfo[key]}">`
  }
  html = html + `
              <button type="submit" class="at-btn submit" id="at-btn">
                Anmelden
              </button>
              </form>`
  return html
}
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
  let html:string = "";
  for (const typekey in logininformation){
    html += returnhtml(typekey,logininformation[typekey])
  }
  context.response.body = `<!DOCTYPE html><html><head><title>hallo</title></head><body>hallo ${html}</body></html>`
});
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({
  port: port,
  secure: true,
  cert: cert,
  key: key,
});





