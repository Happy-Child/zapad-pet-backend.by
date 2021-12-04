import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidRejectReviewRepository, BidsRepository } from './repositories';
import { BidsTodosRepository } from './repositories';
import { EntityFinderModule } from '../entity-finder';
import {
  BidsController,
  BidsTodosController,
  BidsChangeStatusesController,
} from './controllers';
import {
  BidsAssignToEngineerService,
  BidsGeneralService,
  BidsCreateService,
  BidsUpdateService,
  BidsChangeEditableStatusService,
  BidsStartEndWorksService,
  BidsTodosChangeStatusService,
  BidsTodosUpdateService,
  BidsGettingService,
  BidsCancelService,
  BidsSetReviewStatusService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BidsRepository,
      BidsTodosRepository,
      BidRejectReviewRepository,
    ]),
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
    BidsGettingService,
    BidsCancelService,
    BidsSetReviewStatusService,
  ],
  controllers: [
    BidsController,
    BidsTodosController,
    BidsChangeStatusesController,
  ],
  exports: [BidsGeneralService],
})
export class BidsModule {}
