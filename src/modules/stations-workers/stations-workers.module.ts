import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationsWorkersRepository } from './repositories';
import {
  StationsWorkersGeneralService,
  StationsWorkersCheckBeforeUpdateService,
  StationsWorkersCheckBeforeCreateService,
} from './services';
import { EntityFinderModule } from '../entity-finder';
import { ClientsModule } from '../clients';

@Module({
  imports: [
    TypeOrmModule.forFeature([StationsWorkersRepository]),
    EntityFinderModule,
    ClientsModule,
  ],
  providers: [
    StationsWorkersGeneralService,
    StationsWorkersCheckBeforeUpdateService,
    StationsWorkersCheckBeforeCreateService,
  ],
  exports: [
    StationsWorkersGeneralService,
    StationsWorkersCheckBeforeUpdateService,
    StationsWorkersCheckBeforeCreateService,
  ],
})
export class StationsWorkersModule {}
