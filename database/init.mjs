import mysql from "mysql2/promise";
import fs from "node:fs/promises";

const required = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Falta la variable ${key}`);
    process.exit(1);
  }
}

const ssl = process.env.DB_SSL_CA
  ? { ca: process.env.DB_SSL_CA, rejectUnauthorized: true }
  : { rejectUnauthorized: false };

const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl,
  multipleStatements: true,
});

const sql = await fs.readFile(new URL("./schema.sql", import.meta.url), "utf8");
await conn.query(sql);
await conn.end();
console.log("Esquema de EduAdmin creado correctamente.");
