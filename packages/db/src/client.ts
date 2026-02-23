import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";


import dotenv from "dotenv";
dotenv.config({path: "./.env"});

// console.log("DATABASE_URL:", process.env.DATABASE_URL? "set":"not set");

const client = postgres(process.env.DATABASE_URL!);


export const db = drizzle(client);

