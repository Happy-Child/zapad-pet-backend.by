import { Module } from '@nestjs/common';
import { StationsController } from './controllers/stations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationsRepository } from './repositories';
import {
  StationsUpdateService,
  StationsGeneralService,
  StationsCreateService,
  StationsGettingService,
} from './services';
import { DistrictsModule } from '../districts';
import { StationsCheckBeforeUpdateService } from './services/update';
import { EntityFinderModule } from '../entity-finder';
import { StationsUpdateHelpersService } from './services/update/stations-update-helpers.service';
import { ClientsModule } from '../clients';

@Module({
  imports: [
    TypeOrmModule.forFeature([StationsRepository]),
    EntityFinderModule,
    ClientsModule,
    DistrictsModule,
  ],
  controllers: [StationsController],
  providers: [
    StationsGeneralService,
    StationsCreateService,
    StationsCheckBeforeUpdateService,
    StationsUpdateHelpersService,
    StationsUpdateService,
    StationsGettingService,
  ],
  exports: [StationsGeneralService],
})
export class StationsModule {}
