import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { POSTGRES, NODE_ENV } from 'config';
import * as Entities from '@app/entities';
import * as Migrations from './migration';
import * as TestMigrations from './migration-test';
import { ENVIRONMENTS } from '@app/constants';

const entities = Object.values(Entities);
let migrations = Object.values(Migrations);

if ([ENVIRONMENTS.TEST, ENVIRONMENTS.LOCAL].includes(NODE_ENV)) {
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
  migrationsRun: false,
  migrations,
  entities,
  synchronize: false,
  logging: false,
  logger: 'simple-console',
  ...(POSTGRES.SSL
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : null),
  cli: {
    migrationsDir: './migration',
  },
} as TypeOrmModuleOptions;
