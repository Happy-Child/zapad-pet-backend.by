import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ClientsRepository,
  ClientsToStationWorkersRepository,
} from './repositories';
import { ClientsController } from './controllers/clients.controller';
import { ClientsCreateService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClientsToStationWorkersRepository,
      ClientsRepository,
    ]),
  ],
  controllers: [ClientsController],
  providers: [ClientsCreateService],
})
export class ClientsModule {}
