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
} from './services';
import { FileStorageModule } from '@app/file-storage';

@Module({
  imports: [
    TypeOrmModule.forFeature([BidsRepository, BidsTodosRepository]),
    EntityFinderModule,
    FileStorageModule.forRoot(),
  ],
  providers: [
    BidsGeneralService,
    BidsCreateService,
    BidsUpdateService,
    BidsAssignToEngineerService,
    BidsStartEndWorksService,
    BidsChangeEditableStatusService,
  ],
  controllers: [BidsController, BidsTodosController],
})
export class BidsModule {}
