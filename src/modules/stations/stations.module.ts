import { Module } from '@nestjs/common';
import { StationsController } from './controllers/stations.controller';
import { StationsCreateService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationsRepository } from './repositories/stations.repository';
import { UsersStationsWorkersRepository } from '../users/repositories';
import { ClientsRepository } from '../clients/repositories';
import { DistrictsRepository } from '../districts/repositories';
import { StationsCheckBeforeCreateService } from './services/create/stations-check-before-create.service';
import { AggrStationBidStatusCountRepository } from './repositories/aggr-station-bid-status-count.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StationsRepository,
      ClientsRepository,
      DistrictsRepository,
      UsersStationsWorkersRepository,
      AggrStationBidStatusCountRepository,
    ]),
  ],
  controllers: [StationsController],
  providers: [StationsCreateService, StationsCheckBeforeCreateService],
})
export class StationsModule {}
