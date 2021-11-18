import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { POSTGRES } from 'config';
import * as Entities from '@app/entities';
import * as Migrations from './migration';
import * as TestMigrations from './migration-test';
import { NODE_INSTANCE } from '@app/constants';

const entities = Object.values(Entities);
let migrations = Object.values(Migrations);

if (process.env.NODE_ENV === NODE_INSTANCE.TEST) {
  const testMigrations = Object.values(TestMigrations);
  migrations = [...migrations, ...testMigrations];
}

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
  synchronize: false,
  logging: false,
  logger: 'simple-console',
  cli: {
    migrationsDir: './migration',
  },
} as TypeOrmModuleOptions;
