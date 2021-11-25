import { Module } from '@nestjs/common';
import { StationsController } from './controllers/stations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AggrStationBidStatusCountRepository,
  StationsRepository,
} from './repositories';
import {
  StationsUpdateService,
  StationsGeneralService,
  StationsCreateService,
  StationsGettingService,
} from './services';
import { ClientsModule } from '../clients';
import { DistrictsModule } from '../districts';
import { StationsCheckBeforeUpdateService } from './services/update';
import { EntityFinderModule } from '../entity-finder';
import { StationsUpdateHelpersService } from './services/update/stations-update-helpers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StationsRepository,
      AggrStationBidStatusCountRepository,
    ]),
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
