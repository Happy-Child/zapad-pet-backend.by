import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidsRepository } from './repositories';
import { BidsGeneralService } from './services';
import { BidsController } from './controllers/bids.controller';
import { BidsTodosRepository } from './repositories/bids-todos.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BidsRepository, BidsTodosRepository])],
  providers: [BidsGeneralService],
  controllers: [BidsController],
})
export class BidsModule {}
