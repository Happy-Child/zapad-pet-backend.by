import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ExceptionsModule } from '@app/exceptions';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [ExceptionsModule.forRoot()],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
