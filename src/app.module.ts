import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ExceptionsModule } from '@app/exceptions';

@Module({
  imports: [ExceptionsModule.forRoot()],
  controllers: [AppController],
})
export class AppModule {}
