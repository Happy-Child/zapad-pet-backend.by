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

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository])],
  controllers: [UsersController],
  providers: [
    UsersCheckGeneralDataService,
    UsersCheckBeforeCreateService,
    UsersCreateService,
    UsersCheckBeforeUpdateService,
    UsersUpdateService,
    UsersClientsRepository,
    UsersDistrictsRepository,
  ],
})
export class UsersModule {}
