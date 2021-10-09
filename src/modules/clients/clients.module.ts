import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsRepository } from './repositories';
import { ClientsController } from './controllers/clients.controller';
import { ClientsGeneralService, ClientsGettingService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([ClientsRepository])],
  controllers: [ClientsController],
  providers: [ClientsGeneralService, ClientsGettingService],
})
export class ClientsModule {}
