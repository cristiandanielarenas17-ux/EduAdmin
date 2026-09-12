import mysql, { Pool, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { randomUUID } from "crypto";

let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 3307),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "administracion_liceos",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: "utf8mb4",
      dateStrings: true,
      ssl: process.env.DB_SSL_CA
        ? { ca: process.env.DB_SSL_CA, rejectUnauthorized: true }
        : (process.env.DB_SSL_MODE || "REQUIRED").toUpperCase() === "REQUIRED"
          ? { rejectUnauthorized: false }
          : undefined,
    });
  }
  return pool;
}

export async function dbAll<T extends RowDataPacket = RowDataPacket>(sql: string, params: any[] = []) {
  const [rows] = await getPool().query<T[]>(sql, params);
  return rows;
}

export async function dbGet<T extends RowDataPacket = RowDataPacket>(sql: string, params: any[] = []) {
  const rows = await dbAll<T>(sql, params);
  return rows[0] || undefined;
}

export async function dbRun(sql: string, params: any[] = []) {
  const [result] = await getPool().execute<ResultSetHeader>(sql, params);
  return result;
}

export async function dbTransaction(work: (conn: PoolConnection) => Promise<void>) {
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    await work(conn);
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export function newId() {
  return randomUUID();
}

export async function databaseHealth() {
  await getPool().query("SELECT 1 AS ok");
  return true;
}
