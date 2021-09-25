import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ClientsRepository,
  ClientsToStationWorkersRepository,
} from './repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClientsToStationWorkersRepository,
      ClientsRepository,
    ]),
  ],
})
export class ClientsModule {}
