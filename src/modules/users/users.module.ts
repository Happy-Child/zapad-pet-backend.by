import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEmailConfirmedRepository, UsersRepository } from './repositories';
import {
  UsersCreateService,
  UsersUpdateService,
  UsersGeneralService,
  UsersSendingMailService,
  UsersGettingService,
  UsersCheckBeforeUpdateService,
} from './services';
import { MailSenderModule } from '@app/mail-sender';
import { PugModule } from '@app/pug';
import { DistrictsLeadersModule } from '../districts-leaders';
import { StationsWorkersModule } from '../stations-workers';
import { EngineersModule } from '../engineers';
import { EntityFinderModule } from '../entity-finder';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository, UsersEmailConfirmedRepository]),
    EntityFinderModule,
    EngineersModule,
    DistrictsLeadersModule,
    StationsWorkersModule,
    MailSenderModule,
    PugModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersGeneralService,
    UsersCreateService,
    UsersSendingMailService,
    UsersGettingService,
    UsersUpdateService,
    UsersCheckBeforeUpdateService,
  ],
  exports: [UsersGettingService],
})
export class UsersModule {}
