import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config({ path: ".dev.vars" });
import * as process from "node:process";

export default defineConfig({
    dialect: "sqlite",
    driver: "d1-http",
    schema: "./src/schemas",
    out: "./migrations",
    dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID as string,
        databaseId: process.env.CLOUDFLARE_DATABASE_ID as string,
        token: process.env.CLOUDFLARE_API_TOKEN as string,
    },
})