import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationsRepository } from '../stations/repositories';
import { StationsWorkersRepository } from '../stations-workers/repositories';
import { EntityFinderGeneralService } from './services';
import { ClientsRepository } from '../clients/repositories';
import { DistrictsRepository } from '../districts/repositories';
import { UsersRepository } from '../users/repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StationsRepository,
      StationsWorkersRepository,
      ClientsRepository,
      DistrictsRepository,
      UsersRepository,
    ]),
  ],
  providers: [EntityFinderGeneralService],
  exports: [EntityFinderGeneralService],
})
export class EntityFinderModule {}
