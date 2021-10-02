import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ClientsRepository,
  ClientsToStationWorkersRepository,
} from './repositories';
import { ClientsController } from './controllers/clients.controller';
import { ClientsService, ClientsGettingService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClientsToStationWorkersRepository,
      ClientsRepository,
    ]),
  ],
  controllers: [ClientsController],
  providers: [ClientsService, ClientsGettingService],
})
export class ClientsModule {}
