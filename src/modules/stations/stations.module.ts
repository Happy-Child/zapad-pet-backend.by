import { Module } from '@nestjs/common';
import { StationsController } from './controllers/stations.controller';
import { StationsCreateService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationsRepository } from './repositories';
import { UsersStationsWorkersRepository } from '../users/repositories';
import { ClientsRepository } from '../clients/repositories';
import { DistrictsRepository } from '../districts/repositories';
import { StationsCheckWorkersService } from './services';
import { AggrStationBidStatusCountRepository } from './repositories';
import { StationsUpdateService } from './services';

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
  providers: [
    StationsCheckWorkersService,
    StationsCreateService,
    StationsUpdateService,
  ],
})
export class StationsModule {}
