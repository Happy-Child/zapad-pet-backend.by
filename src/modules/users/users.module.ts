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
  UsersCreateService,
  UsersCheckGeneralDataService,
  UsersSendingMailService,
} from './services';
import { ClientsToStationWorkersRepository } from '../clients';
import { DistrictsToEngineersRepository } from '../districts';
import { MailSenderModule } from '@app/mail-sender';
import { PugModule } from '@app/pug';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersRepository,
      UsersClientsRepository,
      UsersDistrictsRepository,
      ClientsToStationWorkersRepository,
      DistrictsToEngineersRepository,
    ]),
    MailSenderModule,
    PugModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersCheckGeneralDataService,
    UsersCheckBeforeCreateService,
    UsersCreateService,
    UsersSendingMailService,
  ],
})
export class UsersModule {}
