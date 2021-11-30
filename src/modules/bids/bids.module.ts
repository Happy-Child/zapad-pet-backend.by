import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidsRepository } from './repositories';
import { BidsController } from './controllers/bids.controller';
import { BidsTodosRepository } from './repositories';
import { EntityFinderModule } from '../entity-finder';
import { BidsTodosController } from './controllers/bids-todos.controller';
import {
  BidsAssignToEngineerService,
  BidsGeneralService,
  BidsCreateService,
  BidsUpdateService,
  BidsChangeEditableStatusService,
  BidsStartEndWorksService,
  BidsTodosChangeStatusService,
  BidsTodosUpdateService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([BidsRepository, BidsTodosRepository]),
    EntityFinderModule,
  ],
  providers: [
    BidsGeneralService,
    BidsCreateService,
    BidsUpdateService,
    BidsAssignToEngineerService,
    BidsStartEndWorksService,
    BidsChangeEditableStatusService,
    BidsTodosChangeStatusService,
    BidsTodosUpdateService,
  ],
  controllers: [BidsController, BidsTodosController],
  exports: [BidsGeneralService],
})
export class BidsModule {}
