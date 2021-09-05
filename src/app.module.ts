import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ExceptionsModule } from '@app/exceptions';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '../ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormconfig,
      migrationsRun: true,
    }),
    ExceptionsModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
