import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UsersClientsRepository,
  UsersDistrictsRepository,
  UsersRepository,
} from './repositories';
import {
  UsersCheckBeforeCreateService,
  UsersCheckBeforeUpdateService,
  UsersCreateService,
  UsersUpdateService,
  UsersCheckGeneralDataService,
} from './services';
import { ClientsToStationWorkersRepository } from '../clients';
import { DistrictsToEngineersRepository } from '../districts';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersRepository,
      UsersClientsRepository,
      UsersDistrictsRepository,
      ClientsToStationWorkersRepository,
      DistrictsToEngineersRepository,
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersCheckGeneralDataService,
    UsersCheckBeforeCreateService,
    UsersCreateService,
    UsersCheckBeforeUpdateService,
    UsersUpdateService,
  ],
})
export class UsersModule {}
