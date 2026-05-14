// Script para corrigir o constraint do banco de disponibilidade
// Executa: npx tsx src/backend/scripts/fix-disponibilidade.ts
import 'reflect-metadata';
import { AppDataSource } from '../config/data-source.js';

async function main() {
  // Conecta sem synchronize para não dar erro
  const ds = new (await import('typeorm')).DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'gestao_professores',
    synchronize: false,
    logging: true,
  });

  await ds.initialize();
  const qr = ds.createQueryRunner();

  try {
    // 1. Descobre o nome da FK que referencia id_professor
    const fks = await qr.query(`
      SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = '${ds.options.database}'
        AND TABLE_NAME = 'disponibilidade'
        AND REFERENCED_TABLE_NAME = 'professor'
    `);
    
    console.log('FKs encontradas:', fks);

    for (const fk of fks) {
      console.log(`Dropando FK: ${fk.CONSTRAINT_NAME}`);
      await qr.query(`ALTER TABLE disponibilidade DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}`);
    }

    // 2. Dropa o index antigo
    try {
      await qr.query(`DROP INDEX IDX_28e6a22297a94a35994065ca94 ON disponibilidade`);
      console.log('Index antigo removido!');
    } catch (e) {
      console.log('Index não existia ou já foi removido');
    }

    // 3. Recria a FK
    await qr.query(`ALTER TABLE disponibilidade ADD CONSTRAINT FK_disp_professor FOREIGN KEY (id_professor) REFERENCES professor(id_professor)`);
    console.log('FK recriada!');

    // 4. Limpa dados antigos duplicados (se houver)
    await qr.query(`DELETE d1 FROM disponibilidade d1 INNER JOIN disponibilidade d2 WHERE d1.id_disponibilidade > d2.id_disponibilidade AND d1.id_professor = d2.id_professor AND d1.dia_semana = d2.dia_semana AND d1.periodo = d2.periodo`);

    console.log('TUDO PRONTO! Agora pode reiniciar o backend.');
  } catch (e) {
    console.error('Erro:', e);
  } finally {
    await qr.release();
    await ds.destroy();
  }
}

main();
