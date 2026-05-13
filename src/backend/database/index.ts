import { AppDataSource } from "../config/data-source.js";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\`;`);
  await connection.end();
}

export const initializeDatabase = async () => {
  try {
    await ensureDatabaseExists();
    await AppDataSource.initialize();
    console.log("✅ Banco de dados conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar no banco:", error);
    process.exit(1);
  }
};
