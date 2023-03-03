import { DataSource, DataSourceOptions, EntitySchema } from 'typeorm';
import { config } from 'dotenv';
config();

export const dbConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  // migrationsRun: false,
  logging: false,
  logger: 'debug',
  migrations: ['dist/models/migrations/*{.js,.ts}'],
};

const dataSource = new DataSource(dbConfig);
export default dataSource;
