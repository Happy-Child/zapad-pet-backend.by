import { Module } from '@nestjs/common';
import { StationsController } from './controllers/stations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AggrStationBidStatusCountRepository,
  StationsRepository,
} from './repositories';
import {
  StationsUpdateService,
  StationsGeneralCheckingService,
  StationsCreateService,
} from './services';
import { ClientsModule } from '../clients';
import { DistrictsModule } from '../districts';
import { StationsWorkersModule } from '../stations-workers';
import { StationsCheckBeforeUpdateService } from './services/update';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StationsRepository,
      AggrStationBidStatusCountRepository,
    ]),
    StationsWorkersModule,
    ClientsModule,
    DistrictsModule,
  ],
  controllers: [StationsController],
  providers: [
    StationsGeneralCheckingService,
    StationsCreateService,
    StationsCheckBeforeUpdateService,
    StationsUpdateService,
  ],
  exports: [StationsGeneralCheckingService],
})
export class StationsModule {}
