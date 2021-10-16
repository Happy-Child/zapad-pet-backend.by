import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UsersDistrictsLeadersRepository,
  UsersEngineersRepository,
  UsersStationsWorkersRepository,
  UsersEmailConfirmedRepository,
  UsersRepository,
} from './repositories';
import {
  UsersCheckBeforeCreateService,
  UsersCreateService,
  UsersGeneralCheckService,
  UsersSendingMailService,
  UsersGettingService,
} from './services';
import { MailSenderModule } from '@app/mail-sender';
import { PugModule } from '@app/pug';
import { DistrictsRepository } from '../districts/repositories';
import { ClientsRepository } from '../clients/repositories';
import { UsersStationsWorkersGeneralService } from './services/general/users-stations-workers-general.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersDistrictsLeadersRepository,
      UsersEngineersRepository,
      UsersStationsWorkersRepository,
      UsersRepository,
      UsersEmailConfirmedRepository,
      DistrictsRepository,
      ClientsRepository,
    ]),
    MailSenderModule,
    PugModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersGeneralCheckService,
    UsersStationsWorkersGeneralService,
    UsersCheckBeforeCreateService,
    UsersCreateService,
    UsersSendingMailService,
    UsersGettingService,
  ],
})
export class UsersModule {}
