import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import fs from 'fs';

let dataSource: DataSource | null = null;

export async function getDatabase(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  const dbPath = process.env.DATABASE_PATH || './data/rocky-calculator.sqlite';
  const resolvedPath = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath);
  const dir = path.dirname(resolvedPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: resolvedPath,
    synchronize: true,
    logging: false,
    entities: [
      {
        name: 'Calculation',
        tableName: 'calculations',
        columns: {
          id: {
            primary: true,
            type: 'integer',
            generated: true,
          },
          expression: {
            type: 'varchar',
          },
          result: {
            type: 'varchar',
          },
          createdAt: {
            type: 'datetime',
            createDate: true,
          },
        },
      },
    ],
  });

  await dataSource.initialize();
  return dataSource;
}
