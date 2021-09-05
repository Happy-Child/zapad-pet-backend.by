import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { POSTGRES } from 'config';

const entities = [];
const migrations = [];

export = {
  type: 'postgres',
  host: POSTGRES.HOST,
  port: POSTGRES.PORT,
  username: POSTGRES.USERNAME,
  password: POSTGRES.PASSWORD,
  database: POSTGRES.DB,
  retryAttempts: POSTGRES.RETRY_ATTEMPTS,
  retryDelay: POSTGRES.RETRY_DELAY,
  migrationsRun: true,
  migrations,
  entities,
  autoLoadModels: true,
  synchronize: true,
  logging: false,
} as TypeOrmModuleOptions;
