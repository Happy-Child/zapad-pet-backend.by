import * as config from 'config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { DEFAULT_APP_API_PORT } from '@app/constants/constants/apps.constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(config.APPS.API.PORT || DEFAULT_APP_API_PORT);
}

bootstrap();
