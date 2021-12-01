import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { BidsRepository, BidsTodosRepository } from '../repositories';
import { BidsGeneralService } from './bids-general.service';
import { BID_STATUS, BID_TODO_STATUS } from '../constants';
import { ExceptionsForbidden } from '@app/exceptions/errors';
import { BIDS_ERRORS } from '@app/constants';

@Injectable()
export class BidsStartEndWorksService {
  constructor(
    private readonly bidsRepository: BidsRepository,
    private readonly bidsTodosRepository: BidsTodosRepository,
    private readonly bidsGeneralService: BidsGeneralService,
  ) {}

  public async startWorkOrFail(bidId: number, userId: number): Promise<void> {
    const bid = await this.bidsGeneralService.bidExistByEngineerOrFail(
      bidId,
      userId,
    );

    if (bid.status !== BID_STATUS.PENDING_START_WORK_FROM_ENGINEER) {
      throw new ExceptionsForbidden([
        {
          field: 'id',
          messages: [BIDS_ERRORS.INVALID_BID_STATUS_FOR_START_WORK],
        },
      ]);
    }

    await this.bidsRepository.updateEntity(
      { id: bidId },
      { status: BID_STATUS.IN_WORK, startWorkAt: moment().toISOString() },
    );
  }

  public async endWorkOrFail(
    bidId: number,
    userId: number,
    finalPhotoId: number,
  ): Promise<void> {
    const bid = await this.bidsGeneralService.bidExistByEngineerOrFail(
      bidId,
      userId,
    );

    if (bid.status !== BID_STATUS.IN_WORK) {
      throw new ExceptionsForbidden([
        {
          field: 'id',
          messages: [BIDS_ERRORS.INVALID_BID_STATUS_FOR_END_WORK],
        },
      ]);
    }

    await this.allBidTodosCompletedOrFail(bidId);

    await this.bidsRepository.updateEntity(
      { id: bidId },
      {
        status: BID_STATUS.PENDING_REVIEW_FROM_DISTRICT_LEADER,
        endWorkAt: moment().toISOString(),
        finalPhotoId,
      },
    );
  }

  private async allBidTodosCompletedOrFail(bidId: number): Promise<void> {
    const todos = await this.bidsTodosRepository.getMany({ bidId });

    const allTodosCompleted = todos.every(
      ({ status }) => status === BID_TODO_STATUS.COMPLETED,
    );

    if (!allTodosCompleted) {
      throw new ExceptionsForbidden([
        {
          field: 'id',
          messages: [BIDS_ERRORS.ALL_BID_TODOS_SHOULD_BE_COMPLETED],
        },
      ]);
    }
  }
}
