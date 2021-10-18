import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidsRepository } from './repositories';
import {
  BidsCreateService,
  BidsGeneralService,
  BidsUpdateService,
} from './services';
import { BidsController } from './controllers/bids.controller';
import { BidsTodosRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([BidsRepository, BidsTodosRepository])],
  providers: [BidsGeneralService, BidsCreateService, BidsUpdateService],
  controllers: [BidsController],
})
export class BidsModule {}
