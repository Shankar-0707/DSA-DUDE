import dotenv from "dotenv";
import { existsSync } from "fs";

// Only load .env file in local development — on Vercel, env vars are injected by the platform
if (existsSync("./config/config.env")) {
    dotenv.config({ path: "./config/config.env" });
}
