import { deleteCookie, getCookie, setCookie } from "@hono/hono/cookie";
import { Context } from "@hono/hono";
import { MissingDataError } from "../classes/errors/controllerErrors/MissingDataError.ts";
function assertCookie(obj: unknown, key: string): asserts obj is string {
  if (obj === undefined) {
    throw new MissingDataError(`${key} Cookie is undefined`);
  }
}
function saveGetCookie(c: Context, key: string): string {
  const value = getCookie(c, key);
  assertCookie(value, key);
  return value;
}
export const HonoCookieAdapter = { saveGetCookie, setCookie, deleteCookie };
export default HonoCookieAdapter;
