import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ExceptionsModule } from '@app/exceptions';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@app/auth';
import { UsersModule } from './modules/users';
import { DistrictsModule } from './modules/districts';
import { BidsModule } from './modules/bids';
import { StationsModule } from './modules/stations';
import { ClientsModule } from './modules/clients';
import { RegionsModule } from './modules/regions';
import ormconfig from '../ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...ormconfig, migrationsRun: true }),
    ExceptionsModule.forRoot(),
    AuthModule,
    UsersModule,
    DistrictsModule,
    BidsModule,
    StationsModule,
    ClientsModule,
    RegionsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
