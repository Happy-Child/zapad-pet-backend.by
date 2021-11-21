import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import {
  APP_SERIALIZER_OPTIONS,
  APP_VALIDATION_PIPE_OPTIONS,
  USER_ROLES,
} from '@app/constants';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { MOCK_STATIONS_WORKERS_MAP } from '../static/mock-data/users/stations-workers.mock';
import { MOCK_DISTRICTS_LEADERS_MAP } from '../static/mock-data/users/districts-leaders.mock';
import { MOCK_ENGINEERS_MAP } from '../static/mock-data/users/engineers.mock';
import {
  MOCK_ACCOUNTANT,
  MOCK_MASTER,
} from '../static/mock-data/users/users.mock';
import { AppModule } from '../src/app.module';
import { MailSenderGeneralService } from '@app/mail-sender/services';

export const bootstrapTestApp = async (): Promise<INestApplication> => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(MailSenderGeneralService)
    .useValue({
      sendMail: () => {
        console.log('Send email on test env');
      },
    })
    .compile();
  const app = moduleRef.createNestApplication();

  app.use(cookieParser());
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe(APP_VALIDATION_PIPE_OPTIONS));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), APP_SERIALIZER_OPTIONS),
  );

  await app.init();
  return app;
};

export const getTestAccessToken = (jwtService: JwtService, sub: number) =>
  jwtService.sign({
    sub,
  });

export const getTestAccessTokensByRoles = (
  jwtService: JwtService,
  {
    stationWorkerId = MOCK_STATIONS_WORKERS_MAP.WORKER_1.id!,
    districtLeaderId = MOCK_DISTRICTS_LEADERS_MAP.LEADER_1.id!,
    engineerId = MOCK_ENGINEERS_MAP.ENGINEER_1.id!,
    accountantId = MOCK_ACCOUNTANT.id,
    masterId = MOCK_MASTER.id,
  }: {
    stationWorkerId?: number;
    districtLeaderId?: number;
    engineerId?: number;
    accountantId?: number;
    masterId?: number;
  } = {},
): Record<USER_ROLES, string> => ({
  [USER_ROLES.STATION_WORKER]: jwtService.sign({
    sub: stationWorkerId,
  }),
  [USER_ROLES.DISTRICT_LEADER]: jwtService.sign({
    sub: districtLeaderId,
  }),
  [USER_ROLES.ENGINEER]: jwtService.sign({
    sub: engineerId,
  }),
  [USER_ROLES.ACCOUNTANT]: jwtService.sign({
    sub: accountantId,
  }),
  [USER_ROLES.MASTER]: jwtService.sign({
    sub: masterId,
  }),
});
