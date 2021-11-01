import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EngineersRepository,
  UsersEmailConfirmedRepository,
  UsersRepository,
} from './repositories';
import {
  UsersCheckBeforeCreateService,
  UsersCreateService,
  UsersGeneralService,
  UsersSendingMailService,
  UsersGettingService,
  StationsWorkersCheckBeforeCreateService,
} from './services';
import { MailSenderModule } from '@app/mail-sender';
import { PugModule } from '@app/pug';
import { DistrictsModule } from '../districts';
import { ClientsModule } from '../clients';
import { DistrictsLeadersModule } from '../districts-leaders';
import { StationsModule } from '../stations';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EngineersRepository,
      UsersRepository,
      UsersEmailConfirmedRepository,
    ]),
    ClientsModule,
    DistrictsModule,
    StationsModule,
    DistrictsLeadersModule,
    MailSenderModule,
    PugModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersGeneralService,
    StationsWorkersCheckBeforeCreateService,
    UsersCheckBeforeCreateService,
    UsersCreateService,
    UsersSendingMailService,
    UsersGettingService,
  ],
  exports: [UsersGettingService],
})
export class UsersModule {}
