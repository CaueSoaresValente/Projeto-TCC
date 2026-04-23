import { AppDataSource } from "../config/data-source.js";

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Banco de dados conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar no banco:", error);
    process.exit(1);
  }
};
