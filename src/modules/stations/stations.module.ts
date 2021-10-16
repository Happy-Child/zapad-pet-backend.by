import { Module } from '@nestjs/common';
import { StationsController } from './controllers/stations.controller';
import { StationsCreateService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationsRepository } from './repositories/stations.repository';
import { UsersStationsWorkersRepository } from '../users/repositories';
import { ClientsRepository } from '../clients/repositories';
import { DistrictsRepository } from '../districts/repositories';
import { StationsCheckBeforeCreateService } from './services/create/stations-check-before-create.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StationsRepository,
      ClientsRepository,
      DistrictsRepository,
      UsersStationsWorkersRepository,
    ]),
  ],
  controllers: [StationsController],
  providers: [StationsCreateService, StationsCheckBeforeCreateService],
})
export class StationsModule {}
