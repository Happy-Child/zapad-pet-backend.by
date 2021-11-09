import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsRepository } from './repositories';
import { ClientsController } from './controllers/clients.controller';
import {
  ClientsCreateService,
  ClientsUpdateService,
  ClientsGettingService,
  ClientsGeneralService,
} from './services';

@Module({
  imports: [TypeOrmModule.forFeature([ClientsRepository])],
  controllers: [ClientsController],
  providers: [
    ClientsCreateService,
    ClientsUpdateService,
    ClientsGettingService,
    ClientsGeneralService,
  ],
  exports: [ClientsGeneralService],
})
export class ClientsModule {}
