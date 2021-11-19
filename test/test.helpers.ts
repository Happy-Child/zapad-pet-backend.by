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
} from '@app/constants';
import { Reflector } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

export const bootstrapTestApp = async (
  moduleRef: TestingModule,
): Promise<INestApplication> => {
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
