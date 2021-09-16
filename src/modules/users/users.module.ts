import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@app/repositories';
import { ClientRepository } from './repositories/client.repository';
import { DistrictRepository } from './repositories/district.repository';
import { CheckUsersBeforeCreateService } from './services/create/check-users-before-create.service';
import { CheckUsersBeforeUpdateService } from './services/update/check-users-before-update.service';
import { UsersCreateService } from './services/create/users-create.service';
import { UsersUpdateService } from './services/update/users-update.service';
import { CheckGeneralUsersDataService } from './services/common/check-general-users-data.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      ClientRepository,
      DistrictRepository,
    ]),
  ],
  controllers: [UsersController],
  providers: [
    CheckGeneralUsersDataService,
    CheckUsersBeforeCreateService,
    UsersCreateService,
    CheckUsersBeforeUpdateService,
    UsersUpdateService,
  ],
})
export class UsersModule {}
