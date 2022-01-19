import config from 'config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import {
  APP_SERIALIZER_OPTIONS,
  APP_VALIDATION_PIPE_OPTIONS,
  DEFAULT_APP_API_PORT,
} from '@app/constants';
import { swaggerBootstrap } from './swagger.bootstrap';
import cors from 'cors';
import { APP_CORS_CONFIG } from './config';

const port = process.env.PORT || DEFAULT_APP_API_PORT;

const appPrefix = `${config.APPS.API.PREFIX}/v1`;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix(appPrefix);
  if (config.CORS) app.use(cors(APP_CORS_CONFIG));
  app.use(cookieParser());
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe(APP_VALIDATION_PIPE_OPTIONS));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), APP_SERIALIZER_OPTIONS),
  );

  swaggerBootstrap(app);
  await app.listen(port);
}

bootstrap();
