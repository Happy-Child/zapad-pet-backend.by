import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExceptionsModule } from '@app/exceptions';
import { UsersModule } from './modules/users';
import { DistrictsModule } from './modules/districts';
import { BidsModule } from './modules/bids';
import { StationsModule } from './modules/stations';
import { ClientsModule } from './modules/clients';
import { RegionsModule } from './modules/regions';
import { AuthModule } from './modules/auth';
import { StationsWorkersModule } from './modules/stations-workers';
import { DistrictsLeadersModule } from './modules/districts-leaders';
import { EngineersModule } from './modules/engineers';
import ormConfig from '../ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ExceptionsModule.forRoot(),
    AuthModule,
    UsersModule,
    StationsWorkersModule,
    DistrictsLeadersModule,
    StationsModule,
    ClientsModule,
    DistrictsModule,
    RegionsModule,
    BidsModule,
    EngineersModule,
  ],
})
export class AppModule {}
