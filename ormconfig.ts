import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { POSTGRES } from 'config';
import * as FilesEntity from '@app/files/entities';
import * as AuthEntities from './src/modules/auth/entities';
import * as UsersEntities from './src/modules/users/entities';
import * as BidsEntities from './src/modules/bids/entities';
import * as ClientsEntities from './src/modules/clients/entities';
import * as DistrictsEntities from './src/modules/districts/entities';
import * as RegionsEntities from './src/modules/regions/entities';
import * as StationsEntities from './src/modules/stations/entities';
import * as Migrations from './migration';
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema';

const entities = [
  FilesEntity,
  AuthEntities,
  UsersEntities,
  BidsEntities,
  ClientsEntities,
  DistrictsEntities,
  RegionsEntities,
  StationsEntities,
].reduce<(Function | string | EntitySchema<any>)[]>(
  (map, entity) => [...map, ...Object.values(entity)],
  [],
);

const migrations = Object.values(Migrations);

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
  cli: {
    migrationsDir: './migration',
  },
} as TypeOrmModuleOptions;
