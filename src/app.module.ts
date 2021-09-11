import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ExceptionsModule } from '@app/exceptions';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { POSTGRES } from 'config';
import * as Entities from '@app/entities';
import { AuthModule } from '@app/auth';

const entities = Object.values(Entities);
const migrations = [];

const ormconfig = {
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
  logger: 'simple-console',
} as TypeOrmModuleOptions;

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ExceptionsModule.forRoot(),
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
