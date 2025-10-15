import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/classes/Repositories/DrizzleDB/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    database: Deno.env.get("DB_NAME")!,
    host: Deno.env.get("DB_HOST")!,
    user: Deno.env.get("DB_USER")!,
    password: Deno.env.get("DB_PASSWORD")!,
  },
});
