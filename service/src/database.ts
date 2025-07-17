import { Client, ClientConfig } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
function requireEnv(key: string): string {
  const value = Deno.env.get(key);
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

const credentials: ClientConfig = {
  hostname: requireEnv("DB_HOST"),
  username: requireEnv("DB_USER"),
  db: requireEnv("DB_NAME"),
  password: requireEnv("DB_PASSWORD"),
};

const client = await new Client().connect(credentials);

export { client };
