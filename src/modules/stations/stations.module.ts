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
} from './services';
import { ClientsModule } from '../clients';
import { DistrictsModule } from '../districts';
import { StationsWorkersModule } from '../stations-workers';
import { StationsCheckBeforeUpdateService } from './services/update';
import { StationsWorkersRepository } from '../stations-workers/repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StationsRepository,
      StationsWorkersRepository,
      AggrStationBidStatusCountRepository,
    ]),
    StationsWorkersModule,
    ClientsModule,
    DistrictsModule,
  ],
  controllers: [StationsController],
  providers: [
    StationsGeneralService,
    StationsCreateService,
    StationsCheckBeforeUpdateService,
    StationsUpdateService,
  ],
  exports: [StationsGeneralService],
})
export class StationsModule {}
