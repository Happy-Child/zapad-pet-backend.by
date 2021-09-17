import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ClientRepository,
  DistrictRepository,
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
  imports: [
    TypeOrmModule.forFeature([
      UsersRepository,
      ClientRepository,
      DistrictRepository,
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
